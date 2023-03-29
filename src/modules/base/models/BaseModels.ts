import { Request } from "express"
import Token from "../../../database/model/final/Token.model"
import User from "../../../database/model/final/User.model"

export interface BaseRequest extends Request {
    token: Token
    user: User
}