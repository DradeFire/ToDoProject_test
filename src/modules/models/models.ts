import { Request } from "express"
import Token from "../../database/model/final/Token"
import User from "../../database/model/final/User"
import { UserModel, ToDoModel, ChangePassModel, IdParamModel, RecoverPassModel, ToDoGroupModel, RoleGroupModel } from "../dto/models"


export interface RequestWithToken<ReqBody> extends Request<IdParamModel, {}, ReqBody, {}> {
    token: Token
    user: User
}


export interface UserRequest extends RequestWithToken<UserModel> { }

export interface TaskRequest extends RequestWithToken<ToDoModel> { }

export interface ChangePassRequest extends RequestWithToken<ChangePassModel> { }

export interface RecoverPassRequest extends RequestWithToken<RecoverPassModel> { }

export interface ToDoGroupRequest extends RequestWithToken<ToDoGroupModel> {}

export interface RoleGroupRequest extends RequestWithToken<RoleGroupModel> {}