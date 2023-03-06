import { Request } from "express"
import Token from "../../../database/model/final/Token.model"
import User from "../../../database/model/final/User.model"
import { IdParamModel } from "../../dto/models"

export interface RequestWithToken<ReqBody> extends Request<IdParamModel, {}, ReqBody, {}> {
    token: Token
    user: User
}