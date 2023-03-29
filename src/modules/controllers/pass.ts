import bcrypt from "bcryptjs";
import { Response } from 'express';
import { JWT_SECRET, OkMessage, StatusCode, Transporter } from "../../utils/constants";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from "../../middleware/custom-error";
import User from "../../database/model/final/User.model";
import { ChangePassModelDto, PayloadResetPassDto, RecoverPassModelDto, UserModelDto } from "../dto/models";
import { BaseRequest } from "../base/models/BaseModels";

export const resetPassword = async (req: BaseRequest, res: Response) => {
    const { email, token } = req.params;

    const secret = JWT_SECRET + req.body.email
    const payload = jwt.verify(token, secret)

    if ((payload as PayloadResetPassDto).email as string !== email) {
        throw new ErrorResponse("TOKEN_INCORRECT", StatusCode.UNAUTHORIZED_403);
    }

    const candidate = await User.findOne({
        where: {
            email: email
        }
    });
    if (!candidate) {
        throw new ErrorResponse("INCORRECT_LOGIN", StatusCode.BAD_REQUEST_400);
    }

    res.render('reset-password', {
        email: email
    })
};

export const resetPassSendMail = async (req: BaseRequest, res: Response) => {
    const dto: UserModelDto = req.body

    const secret = JWT_SECRET + dto.email
    const payload = {
        email: dto.email,
        firstName: dto.firstName
    }
    const token = jwt.sign(payload, secret, { expiresIn: '5m' })
    const link = `http://localhost:${process.env.PORT}/api/auth/reset-password/${dto.email}/${token}`


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
        to: `User <${dto.email}>`, // list of receivers
        subject: "Recover password", // Subject line
        text: link, // plain text body
        html: '<p><b>Hello</b> to myself!</p>'
    }, (err, info) => {
        console.log(err)
        console.log(info)
        res.json(OkMessage);
    });
};

export const recoverPass = async (req: BaseRequest, res: Response) => {
    const dto: RecoverPassModelDto = req.body

    if (dto.password !== dto.againPassword) {
        throw new ErrorResponse("PASSWORDS_NOT_EQUAL", StatusCode.BAD_REQUEST_400)
    }

    const candidate = await User.findOne({
        where: {
            email: dto.email
        }
    });

    const salt = bcrypt.genSaltSync(10);
    await candidate?.update(
        {
            pass: bcrypt.hashSync(dto.password, salt),
        },
        {
            where: {
                email: dto.email,
            },
        }
    );

    res.json(OkMessage);
};

export const changePassword = async (req: BaseRequest, res: Response) => {
    const dto: ChangePassModelDto = req.body

    const lastPassword = dto.lastPassword;
    const newPassword = dto.newPassword;

    const passwordResult = bcrypt.compareSync(lastPassword, req.user.pass);
    if (!passwordResult) {
        throw new ErrorResponse("INCORRECT_LAST_PASSWORD", StatusCode.BAD_REQUEST_400);
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
