import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { ErrorReasons, StatusCode } from "../utils/constants";
import { ErrorResponse } from "./custom-error";

@Catch(ErrorResponse)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(err: ErrorResponse, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        console.log(ErrorReasons.ERROR, {
            message: err.message,
            stack: err.stack,
        });

        res.status(err.code || StatusCode.SERVER_ERROR_500).json({
            message: err.message,
        });
    }
}