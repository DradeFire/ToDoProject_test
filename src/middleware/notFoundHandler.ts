import { ErrorResponse } from "./custom-error";
import { ErrorReasons, StatusCode } from "../utils/constants";
import { FastifyReply, FastifyRequest } from "fastify";

export const notFound = (_req: FastifyRequest, _res: FastifyReply) => {
  throw new ErrorResponse(ErrorReasons.NOT_FOUND_404, StatusCode.NOT_FOUND_404);
};
