import { FastifyRequest } from "fastify"
import Token from "../../../database/model/final/Token.model"
import User from "../../../database/model/final/User.model"
import { HeadersModel, IdParamModel } from "../../dto/models"

export interface SchemeWithToken<ReqBody> extends FastifyRequest<{
    Body: ReqBody,
    Params: IdParamModel,
    Headers: HeadersModel,
}> {
    token: Token,
    user: User,
}

// export const SchemeWithToken = Type.Object({
//     token: Type.Any(Token),
//     user: Type.Any(User),

//     body: ReqBody,
//     params: Type.Any(IdParamModel),
//     headers: Type.Any(HeadersModel)
// })