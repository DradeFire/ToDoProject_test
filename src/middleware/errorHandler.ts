import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { ErrorReasons, StatusCode } from "../utils/constants";
import { ErrorResponse } from "./custom-error";

export const errorHandler = (err: ErrorResponse, _req: FastifyRequest, res: FastifyReply) => {
    console.log(ErrorReasons.ERROR, {
        message: err.message,
        stack: err.stack,
    });

    res.status(err.code || StatusCode.SERVER_ERROR_500).send({
        message: err.message,
    });
};
