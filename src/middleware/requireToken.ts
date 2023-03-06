import { HookHandlerDoneFunction } from "fastify/types/hooks";
import { FastifyReply } from "fastify/types/reply";
import Token from "../database/model/final/Token.model";
import User from "../database/model/final/User.model";
import { SchemeWithToken } from "../modules/base/models/BaseModels";
import { ErrorReasons, StatusCode, UrlConst } from "../utils/constants";
import { ErrorResponse } from "./custom-error";

export const requireToken = async <K, T extends SchemeWithToken<K>>(req: T, _res: FastifyReply, next: HookHandlerDoneFunction) => {
    const token = req.headers.Authorization;
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
    next();
};