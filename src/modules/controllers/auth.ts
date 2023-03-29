import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { Response } from 'express';
import { OkMessage, StatusCode } from "../../utils/constants";
import { ErrorResponse } from "../../middleware/custom-error";
import User from "../../database/model/final/User.model";
import Token from "../../database/model/final/Token.model";
import { checkExistCandidate, getAndCheckAuthCandidate } from "../base/controllers/BaseAuth";
import { BaseRequest } from "../base/models/BaseModels";
import { UserModelDto } from "../dto/models";

export const login = async (req: BaseRequest, res: Response) => {
  const dto: UserModelDto = req.body

  const candidate = await getAndCheckAuthCandidate(req.body.email)

  const passwordResult = bcrypt.compareSync(
    dto.pass,
    candidate.pass
  );

  if (!passwordResult) {
    throw new ErrorResponse("INCORRECT_PASSWORD", StatusCode.BAD_REQUEST_400);
  }

  const newToken = await Token.create({
    userEmail: candidate.email,
    value: nanoid(128),
  });

  res.json(newToken.toJSON());
};

export const registration = async (req: BaseRequest, res: Response) => {
  const dto: UserModelDto = req.body

  await checkExistCandidate(dto.email)

  const hashPassword = bcrypt.hashSync(dto.pass, bcrypt.genSaltSync(10));
  const user = await User.create({
    email: dto.email,
    pass: hashPassword,
    firstName: dto.firstName,
    birthDate: dto.birthDate
  });

  res.json(user.toJSON());
};

export const logout = async (req: BaseRequest, res: Response) => {
  await req.token.destroy();
  res.json(OkMessage);
};

export const me = async (req: BaseRequest, res: Response) => {
  res.json(req.user.toJSON());
};
