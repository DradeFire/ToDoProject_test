import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { deleteProfile, updateProfile } from "../modules/controllers/profile";

const profileRoutes = Router();

profileRoutes.patch("/", asyncHandler(updateProfile)); // update profile
profileRoutes.delete("/", asyncHandler(deleteProfile)); // delete profile

export {
    profileRoutes
};