import { FastifyInstance } from "fastify/types/instance";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireToken } from "../middleware/requireToken";
import { login, registration, logout, me } from "../modules/controllers/auth";
import { resetPassword, resetPassSendMail, recoverPass, changePassword } from "../modules/controllers/pass";

export function authRoutes(app: FastifyInstance) {
  app.route({ method: ['GET'], url: "/api/auth/me", preHandler: asyncHandler(requireToken), handler: asyncHandler(me) });
  app.route({
    method: ['GET'],
    url: "/api/auth/reset-password/:email/:token",
    preHandler: asyncHandler(requireToken),
    handler: asyncHandler(resetPassword)
  }); // Выдаст web-форму
  app.route({
    method: ['POST'],
    url: "/api/auth/reset-password-send-mail",
    preHandler: asyncHandler(requireToken),
    handler: asyncHandler(resetPassSendMail)
  }); // Отсылает на почту ссылку-рекавер
  app.route({
    method: ['POST'],
    url: "/api/auth/recover-pass",
    preHandler: asyncHandler(requireToken),
    handler: asyncHandler(recoverPass)
  }); // Отправление нового пароля после заполнения формы /forgot-pass
  app.route({ method: ['POST'], url: "/api/auth/login", preHandler: asyncHandler(requireToken), handler: asyncHandler(login) });
  app.route({ method: ['POST'], url: "/api/auth/logout", preHandler: asyncHandler(requireToken), handler: asyncHandler(logout) });
  app.route({ method: ['POST'], url: "/api/auth/registration", preHandler: asyncHandler(requireToken), handler: asyncHandler(registration) });
  app.route({ method: ['PATCH'], url: "/api/auth/change-password", preHandler: asyncHandler(requireToken), handler: asyncHandler(changePassword) });
}


