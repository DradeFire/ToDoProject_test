import { SchemeWithToken } from "../base/models/BaseModels";
import { UserModel, ToDoModel, ChangePassModel, RecoverPassModel, ToDoGroupModel, RoleGroupModel, ChangeLinkModel } from "../dto/models"


export interface UserRequest extends SchemeWithToken<UserModel> {}

export interface TaskRequest extends SchemeWithToken<ToDoModel> {}

export interface ChangePassRequest extends SchemeWithToken<ChangePassModel> {}

export interface RecoverPassRequest extends SchemeWithToken<RecoverPassModel> {}

export interface ToDoGroupRequest extends SchemeWithToken<ToDoGroupModel> {}

export interface RoleGroupRequest extends SchemeWithToken<RoleGroupModel> {}

export interface ChangeLinkRequest extends SchemeWithToken<ChangeLinkModel> {}
