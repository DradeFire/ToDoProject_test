import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { Response } from 'express';
import { UserRequest } from '../models/models';
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { ErrorResponse } from "../../middleware/custom-error";
import User from "../../database/model/final/User.model";
import Token from "../../database/model/final/Token.model";
import BaseAuth from "../base/controllers/BaseAuth";
import RequireTokenService from "../../middleware/requireToken";
import { Controller, Get, Post, Req, Res, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from "../../middleware/errorHandler";

@Controller("/api/auth")
@UseFilters(HttpExceptionFilter)
export default class AuthController extends BaseAuth {


  constructor(private requireTokenService: RequireTokenService) {
    super();
  }

  @Post('login')
  async login(@Req() req: UserRequest, @Res() res: Response) {

    if (!req.body.email) {
      throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.pass) {
      throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const candidate = await this.getAndCheckAuthCandidate(req.body.email)

    const passwordResult = bcrypt.compareSync(
      req.body.pass,
      candidate.pass
    );

    if (!passwordResult) {
      throw new ErrorResponse(ErrorReasons.INCORRECT_PASSWORD_400, StatusCode.BAD_REQUEST_400);
    }

    const newToken = await Token.create({
      userEmail: candidate.email,
      value: nanoid(128),
    });

    res.json(newToken.toJSON());
  };

  @Post('registration')
  async registration(@Req() req: UserRequest, @Res() res: Response) {

    if (!req.body.email) {
      throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.pass) {
      throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.firstName) {
      throw new ErrorResponse(ErrorReasons.FIRSTNAME_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.birthDate) {
      throw new ErrorResponse(ErrorReasons.BIRTHDATE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    await this.checkExistCandidate(req.body.email)

    const hashPassword = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync(10));
    const user = await User.create({
      email: req.body.email,
      pass: hashPassword,
      firstName: req.body.firstName,
      birthDate: req.body.birthDate
    });

    res.json(user.toJSON());
  };

  @Post('logout')
  async logout(@Req() req: UserRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    await req.token.destroy();
    res.json(OkMessage);
  };

  @Get('me')
  async me(@Req() req: UserRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    res.json(req.user.toJSON());
  };
}


