import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  create,
  update,
  getAll,
  getById,
  deleteById,
  deleteAll,
  getTaskUserList,
  addToFavouriteList,
  getTaskInviteLink,
  updateTaskInviteLink,
  inviteHandler,
} from "../modules/controllers/tasks";

const taskRoutes = Router();

taskRoutes.get("/", asyncHandler(getAll)); // получить все таски
taskRoutes.get("/:id", asyncHandler(getById)); // получить по id
taskRoutes.get("/user-list/:id", asyncHandler(getTaskUserList)) // получить список юзеров с доступом к таске
taskRoutes.get("/invite-link/:id", asyncHandler(getTaskInviteLink)) // получить линку
taskRoutes.get("/invite/:token", asyncHandler(inviteHandler)) // перейти по приглашению
taskRoutes.post("/", asyncHandler(create)); // создать таск
taskRoutes.post("/favourite/:id", asyncHandler(addToFavouriteList)) // добавить в избранное
taskRoutes.patch("/:id", asyncHandler(update)); // изменить таск
taskRoutes.patch("/invite-link/:id", asyncHandler(updateTaskInviteLink)) // редактировать линку
taskRoutes.delete("/", asyncHandler(deleteAll)); // удалить все таски
taskRoutes.delete("/:id", asyncHandler(deleteById)); // удалить по id

export {
  taskRoutes
};
