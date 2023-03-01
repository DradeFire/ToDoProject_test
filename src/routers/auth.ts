import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireToken } from "../middleware/requireToken";
import { login, registration, logout, me } from "../modules/controllers/auth";
import { resetPassword, resetPassSendMail, recoverPass, changePassword } from "../modules/controllers/pass";

const authRoutes = Router();

authRoutes.get(
  "/me",
  asyncHandler(requireToken),
  asyncHandler(me)
);
authRoutes.get("/reset-password/:email/:token", asyncHandler(resetPassword)); // Выдаст web-форму
authRoutes.post("/reset-password-send-mail", asyncHandler(resetPassSendMail)); // Отсылает на почту ссылку-рекавер
authRoutes.post("/recover-pass", asyncHandler(recoverPass)); // Отправление нового пароля после заполнения формы /forgot-pass
authRoutes.post("/login", asyncHandler(login));
authRoutes.post("/logout", asyncHandler(logout));
authRoutes.post("/registration", asyncHandler(registration));
authRoutes.patch(
  "/change-password",
  asyncHandler(requireToken),
  asyncHandler(changePassword)
);

export {
  authRoutes
};
