import { asyncHandler } from "../middleware/asyncHandler";
import { addToFavouriteList, createGroup, deleteGroup, getGroupInviteLink, getGroupUserList, inviteHandler, updateGroup, updateGroupInviteLink } from "../modules/controllers/group";
import { addUser, deleteUser, updateRole, leaveGroup } from "../modules/controllers/group_user_manipulations";

const groupRoutes = Router();

groupRoutes.get("/invite-link/:id", asyncHandler(getGroupInviteLink)) // получить линку
groupRoutes.get("/user-list/:id", asyncHandler(getGroupUserList)) // получить список юзеров с доступом к таске
groupRoutes.get("/invite/:token", asyncHandler(inviteHandler)) // перейти по приглашению
groupRoutes.post("/", asyncHandler(createGroup)); // create group
groupRoutes.post("/user/", asyncHandler(addUser)); // add user to group
groupRoutes.post("/favourite/:id", asyncHandler(addToFavouriteList)) // добавить в избранное
groupRoutes.patch("/invite-link/:id", asyncHandler(updateGroupInviteLink)) // редактировать линку
groupRoutes.patch("/", asyncHandler(updateGroup)); // update group
groupRoutes.patch("/user/", asyncHandler(updateRole)); // change user role
groupRoutes.delete("/", asyncHandler(deleteGroup)); // delete group
groupRoutes.delete("/user/", asyncHandler(deleteUser)); // delete user from group
groupRoutes.delete("/user/me", asyncHandler(leaveGroup)); // leave group

export default groupRoutes;