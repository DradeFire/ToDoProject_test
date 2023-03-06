import Token from "../database/model/final/Token.model";
import User from "../database/model/final/User.model";
import { RequestWithToken } from "../modules/base/models/BaseModels";
import { ErrorReasons, StatusCode, UrlConst } from "../utils/constants";
import { ErrorResponse } from "./custom-error";
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export default class RequireTokenService {
    async requireToken<K, T extends RequestWithToken<K>>(req: T, _res: Response) {
        const token = req.header(UrlConst.HEADER_ACCESS_TOKEN);
        
        if (!token) {
            throw new ErrorResponse(ErrorReasons.NO_TOKEN_SEND_403, StatusCode.UNAUTHORIZED_403);
        }

        const tokenFromDb = await Token.findOne({
            where: {
                value: token
            }
        });

        if (!tokenFromDb) {
            throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
        }

        const user = await User.findOne({
            where: {
                email: tokenFromDb.userEmail
            }
        });

        if (!user) {
            throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
        }

        req.token = tokenFromDb;
        req.user = user;
    };
}

