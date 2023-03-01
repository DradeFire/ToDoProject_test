import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "./custom-error";
import { ErrorReasons, StatusCode } from "../utils/constants";

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new ErrorResponse(ErrorReasons.NOT_FOUND_404, StatusCode.NOT_FOUND_404));
};

export {
  notFound
}