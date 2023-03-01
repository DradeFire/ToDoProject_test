import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createGroup, deleteGroup, updateGroup } from "../modules/controllers/group";
import { addUser, deleteUser, updateRole, leaveGroup } from "../modules/controllers/group_role";

const groupRoutes = Router();

groupRoutes.post("/", asyncHandler(createGroup)); // create group
groupRoutes.post("/add-user", asyncHandler(addUser)); // add user to group
groupRoutes.patch("/", asyncHandler(updateGroup)); // update group
groupRoutes.patch("/update-user-role", asyncHandler(updateRole)); // change user role
groupRoutes.delete("/", asyncHandler(deleteGroup)); // delete group
groupRoutes.delete("/delete-user", asyncHandler(deleteUser)); // delete user from group
groupRoutes.delete("/leave-group", asyncHandler(leaveGroup)); // leave group

export {
    groupRoutes
};