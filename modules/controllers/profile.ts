import { Response } from "express";
import RoleGroup from "../../database/model/RoleGroup";
import Task from "../../database/model/Task";
import ToDoGroup from "../../database/model/ToDoGroup";
import User from "../../database/model/User";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { UserRequest } from "../models/models";

const updateProfile = async (req: UserRequest, res: Response) => {
    if (!req.body.email) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.firstName) {
        throw new ErrorResponse(ErrorReasons.FIRSTNAME_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const candidateWithEmail = await User.findByPk(req.body.email);
    if (candidateWithEmail) {
        throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.BAD_REQUEST_400);
    }

    const candidate = await User.findByPk(req.token.userEmail);
    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
    }

    await candidate.update({
        email: req.body.email,
        firstName: req.body.firstName
    });

    res.json(OkMessage);
}

const deleteProfile = async (req: UserRequest, res: Response) => {
    const candidate = await User.findByPk(req.token.userEmail);
    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
    }

    const groupList = await ToDoGroup.findAll({
        where: {
            ownerEmail: req.token.userEmail
        },
    });

    await groupList.forEach(async (val, _index, _array) => {
        await Task.destroy({
            where: {
                group: val.title
            },
        });

        await RoleGroup.destroy({
            where: {
                groupTitle: val.title
            },
        });
    });


    res.json(OkMessage);
}

export {
    updateProfile,
    deleteProfile
}
