import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { Response } from 'express';
import { UserRequest } from '../models/models';
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { ErrorResponse } from "../../middleware/custom-error";
import User from "../../database/model/final/User.model";
import Token from "../../database/model/final/Token.model";
import { checkExistCandidate, getAndCheckAuthCandidate } from "../base/controllers/BaseAuth";

export const login = async (req: UserRequest, res: Response) => {
  if (!req.body.email) {
    throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.pass) {
    throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }

  const candidate = await getAndCheckAuthCandidate(req.body.email)

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

export const registration = async (req: UserRequest, res: Response) => {
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

  await checkExistCandidate(req.body.email)

  const hashPassword = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync(10));
  const user = await User.create({
    email: req.body.email,
    pass: hashPassword,
    firstName: req.body.firstName,
    birthDate: req.body.birthDate
  });

  res.json(user.toJSON());
};

export const logout = async (req: UserRequest, res: Response) => {
  await req.token.destroy();
  res.json(OkMessage);
};

export const me = async (req: UserRequest, res: Response) => {
  res.json(req.user.toJSON());
};
