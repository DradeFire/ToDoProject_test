import { NextFunction, Response, Request } from "express";
import { ErrorReasons, StatusCode } from "../utils/constants";
import { ErrorResponse } from "./custom-error";

export const errorHandler = (err: ErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
    console.log(ErrorReasons.ERROR, {
        message: err.message,
        stack: err.stack,
    });

    res.status(err.code || StatusCode.SERVER_ERROR_500).json({
        message: err.message,
    });
};
