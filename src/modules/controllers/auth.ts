import User from "../../database/model/User";
import { Token } from "../../database/model/Token";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { Response } from 'express';
import { UserRequest } from '../models/models';
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { ErrorResponse } from "../../middleware/custom-error";

const login = async (req: UserRequest, res: Response) => {
  if (!req.body.email) {
    throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.pass) {
    throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }

  const candidate = await User.findByPk(req.body.email);
  if (!candidate) {
    throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
  }

  const passwordResult = bcrypt.compareSync(
    req.body.pass,
    candidate.pass as string
  );

  if (!passwordResult) {
    throw new ErrorResponse(ErrorReasons.INCORRECT_PASSWORD_400, StatusCode.BAD_REQUEST_400);
  }

  const newToken = await Token.create({
    userEmail: candidate.email,
    value: nanoid(128),
  });

  res.json(newToken);
};

const registration = async (req: UserRequest, res: Response) => {
  if (!req.body.email) {
    throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.pass) {
    throw new ErrorResponse(ErrorReasons.PASSWORD_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.firstName) {
    throw new ErrorResponse(ErrorReasons.FIRSTNAME_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }

  const candidate = await User.findByPk(req.body.email);
  if (candidate) {
    throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.BAD_REQUEST_400);
  }

  const salt = bcrypt.genSaltSync(10);
  const password = req.body.pass;
  const hashPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({
    email: req.body.email,
    pass: hashPassword,
    firstName: req.body.firstName
  });

  res.json(user.toJSON());
};

const logout = async (req: UserRequest, res: Response) => {
  await req.token.destroy();
  res.json(OkMessage);
};

const me = async (req: UserRequest, res: Response) => {
  const user = await User.findByPk(req.token.userEmail);
  res.json(user?.toJSON());
};

export {
  login,
  registration,
  logout,
  me,
};
