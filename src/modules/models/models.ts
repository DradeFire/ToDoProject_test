import { RequestWithToken } from "../base/models/BaseModels";
import { UserModel, ToDoModel, ChangePassModel, RecoverPassModel, ToDoGroupModel, RoleGroupModel, ChangeLinkModel } from "../dto/models"


export interface UserRequest extends RequestWithToken<UserModel> { }

export interface TaskRequest extends RequestWithToken<ToDoModel> { }

export interface ChangePassRequest extends RequestWithToken<ChangePassModel> { }

export interface RecoverPassRequest extends RequestWithToken<RecoverPassModel> { }

export interface ToDoGroupRequest extends RequestWithToken<ToDoGroupModel> {}

export interface RoleGroupRequest extends RequestWithToken<RoleGroupModel> {}

export interface ChangeLinkRequest extends RequestWithToken<ChangeLinkModel> {}
