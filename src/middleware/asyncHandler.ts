import { HookHandlerDoneFunction } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";

export const asyncHandler = (fn: Function) => (req: FastifyRequest, res: FastifyReply, /*next: HookHandlerDoneFunction*/) => {
  Promise.resolve(fn(req, res))//.catch(next());
};
