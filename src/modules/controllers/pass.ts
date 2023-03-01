import User from "../../database/model/User";
import bcrypt from "bcryptjs";
import { Response } from 'express';
import { UserRequest, ChangePassRequest, RecoverPassRequest } from '../models/models';
import { ErrorReasons, JWT_SECRET, OkMessage, StatusCode, Transporter, UrlConst } from "../../utils/constants";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import CurrentEnv, { Env } from "../../utils/env_config";
import { ErrorResponse } from "../../middleware/custom-error";


function getCurrentPort(): number {
    switch (CurrentEnv.env) {
        case Env.DEV: {
            return UrlConst.DEV_PORT;
        }
        case Env.TEST: {
            return UrlConst.DEV_PORT;
        }
        case Env.PROD: {
            return UrlConst.PROD_PORT;
        }
    }
}


const resetPassword = async (req: UserRequest, res: Response) => {
    const { email, token } = req.params;

    const secret = JWT_SECRET + email
    const payload = jwt.verify(token, secret)

    // if (payload.email as string !== email) {
    //     throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
    // }

    const candidate = await User.findByPk(email);
    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
    }

    res.render('reset-password', {
        email: email
    })
};

const resetPassSendMail = async (req: UserRequest, res: Response) => {
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

const recoverPass = async (req: RecoverPassRequest, res: Response) => {
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

    const candidate = await User.findByPk(req.body.email);

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

const changePassword = async (req: ChangePassRequest, res: Response) => {
    if (!req.body.lastPassword) {
        throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.newPassword) {
        throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const lastPassword = req.body.lastPassword;
    const newPassword = req.body.newPassword;

    const candidate = await User.findByPk(req.token.userEmail);

    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
    }

    const passwordResult = bcrypt.compareSync(lastPassword, candidate.pass as string);
    if (!passwordResult) {
        throw new ErrorResponse(ErrorReasons.INCORRECT_LAST_PASSWORD_400, StatusCode.BAD_REQUEST_400);
    }

    const salt = bcrypt.genSaltSync(10);
    await candidate.update(
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

export {
    resetPassword,
    resetPassSendMail,
    recoverPass,
    changePassword
}


