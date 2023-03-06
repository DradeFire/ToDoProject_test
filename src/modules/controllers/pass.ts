import bcrypt from "bcryptjs";
import { Response } from 'express';
import { UserRequest, ChangePassRequest, RecoverPassRequest } from '../models/models';
import { ErrorReasons, JWT_SECRET, OkMessage, StatusCode, Transporter } from "../../utils/constants";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from "../../middleware/custom-error";
import User from "../../database/model/final/User.model";
import { getCurrentPort } from "../../utils/env_config";
import { PayloadResetPass } from "../dto/models";
import RequireTokenService from "../../middleware/requireToken";
import { Controller, Get, Post, Req, Res, Patch, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from "../../middleware/errorHandler";


@Controller("/api/auth")
@UseFilters(HttpExceptionFilter)
export default class PassController {

    constructor(private requireTokenService: RequireTokenService) {
    }

    @Get("/reset-password/:email/:token")
    async resetPassword(@Req() req: UserRequest, @Res() res: Response) {

        const { email, token } = req.params;

        const secret = JWT_SECRET + req.body.email
        const payload = jwt.verify(token, secret)

        if ((payload as PayloadResetPass).email as string !== email) {
            throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
        }

        const candidate = await User.findOne({
            where: {
                email: email
            }
        });
        if (!candidate) {
            throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
        }

        res.render('reset-password', {
            email: email
        })
    };

    @Post("/reset-password-send-mail")
    async resetPassSendMail(@Req() req: UserRequest, @Res() res: Response) {

        if (!req.body.email) {
            throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }
        if (!req.body.firstName) {
            throw new ErrorResponse(ErrorReasons.FIRSTNAME_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }

        const secret = JWT_SECRET + req.body.email
        const payload = {
            email: req.body.email,
            firstName: req.body.firstName
        }
        const token = jwt.sign(payload, secret, { expiresIn: '5m' })
        const link = `http://localhost:${getCurrentPort()}/api/auth/reset-password/${req.body.email}/${token}`


        const transporter = nodemailer.createTransport({
            host: Transporter.HOST,
            port: Transporter.PORT,
            secure: Transporter.ISSECURE,
            auth: {
                user: Transporter.USER,
                pass: Transporter.PASS,
            },
        }, {
            from: `ToDo <${Transporter.USER}>`, // sender address
        });

        await transporter.sendMail({
            to: `User <${req.body.email}>`, // list of receivers
            subject: "Recover password", // Subject line
            text: link, // plain text body
            html: '<p><b>Hello</b> to myself!</p>'
        }, (err, info) => {
            console.log(err)
            console.log(info)
            res.json(OkMessage);
        });
    };

    @Post("/recover-pass")
    async recoverPass(@Req() req: RecoverPassRequest, @Res() res: Response) {

        if (!req.body.email) {
            throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }
        if (!req.body.password) {
            throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }
        if (!req.body.againPassword) {
            throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }

        if (req.body.password !== req.body.againPassword) {
            throw new ErrorResponse(ErrorReasons.PASSWORDS_NOT_EQUAL_400, StatusCode.BAD_REQUEST_400)
        }

        const candidate = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        const salt = bcrypt.genSaltSync(10);
        await candidate?.update(
            {
                pass: bcrypt.hashSync(req.body.password, salt),
            },
            {
                where: {
                    email: req.body.email,
                },
            }
        );

        res.json(OkMessage);
    };

    @Patch("/change-password")
    async changePassword(@Req() req: ChangePassRequest, @Res() res: Response) {
        await this.requireTokenService.requireToken(req, res)

        if (!req.body.lastPassword) {
            throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }
        if (!req.body.newPassword) {
            throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }

        const lastPassword = req.body.lastPassword;
        const newPassword = req.body.newPassword;

        const passwordResult = bcrypt.compareSync(lastPassword, req.user.pass);
        if (!passwordResult) {
            throw new ErrorResponse(ErrorReasons.INCORRECT_LAST_PASSWORD_400, StatusCode.BAD_REQUEST_400);
        }

        const salt = bcrypt.genSaltSync(10);
        await req.user.update(
            {
                pass: bcrypt.hashSync(newPassword, salt),
            },
            {
                where: {
                    email: req.token.userEmail,
                },
            }
        );

        res.json(OkMessage);
    };
}


