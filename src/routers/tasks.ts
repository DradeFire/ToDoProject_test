import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  create,
  update,
  getAll,
  getById,
  deleteById,
  deleteAll,
} from "../modules/controllers/tasks";

const taskRoutes = Router();

taskRoutes.get("/", asyncHandler(getAll));
taskRoutes.get("/:id", asyncHandler(getById));
taskRoutes.post("/", asyncHandler(create));
taskRoutes.patch(
  "/:id",
  asyncHandler(update)
);
taskRoutes.delete(
  "/",
  asyncHandler(deleteAll)
);
taskRoutes.delete(
  "/:id",
  asyncHandler(deleteById)
);

export {
  taskRoutes
};
