import { Response } from "express";
import MMUserToDo from "../../database/model/relations/MMUserToDo";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { UserRequest } from "../models/models";

export const updateProfile = async (req: UserRequest, res: Response) => {
    if (!req.body.firstName) {
        throw new ErrorResponse(ErrorReasons.FIRSTNAME_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.birthDate) {
        throw new ErrorResponse(ErrorReasons.BIRTHDATE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    await req.user.update({
        birthDate: req.body.birthDate,
        firstName: req.body.firstName
    });

    res.json(OkMessage);
}

export const deleteProfile = async (req: UserRequest, res: Response) => {
    const groupIdList = await MMUserToDoGroup.findAll({
        where: {
            userId: req.user.id,
            role: "read-write"
        },
    });

    groupIdList.forEach(async (val, _index, _arr) => {
        const groupUserList = await MMUserToDoGroup.findAll({
            where: {
                groupId: val.groupId,
                role: "read-write"
            }
        });
        if (groupUserList.length == 1) {
            // TODO - удалить группу
        }
    });

    const taskIdList = await MMUserToDo.findAll({
        where: {
            userId: req.user.id
        },
    });

    taskIdList.forEach(async (val, _index, _arr) => {
        const taskIdList = await MMUserToDo.findAll({
            where: {
                taskId: val.taskId
            }
        });
        if (taskIdList.length == 1) {
            // TODO - удалить task
        }
    });

    res.json(OkMessage);
}
