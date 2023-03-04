import { Response } from "express";
import Task from "../../database/model/final/Task";
import ToDoGroup from "../../database/model/final/ToDoGroup";
import MMToDoToDoGroup from "../../database/model/relations/MMToDoToDoGroup";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { ToDoGroupRequest } from "../models/models";


export const createGroup = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.body.title) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.description) {
        throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const candidate = await ToDoGroup.findOne({
        where: {
            title: req.body.title
        }
    });
    if (candidate) {
        throw new ErrorResponse(ErrorReasons.GROUP_EXIST_400, StatusCode.BAD_REQUEST_400);
    }

    const group = await ToDoGroup.create({
        title: req.body.title,
        description: req.body.description
    });

    await MMUserToDoGroup.create({
        userId: req.user.id,
        groupId: group.id,
        role: "read-write"
    });

    res.json(group.toJSON());
}

export const updateGroup = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.body.groupId) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (!req.body.title) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.description) {
        throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const groupIDElement = await MMUserToDoGroup.findOne({
        where: {
            groupId: req.body.groupId,
            userId: req.user.id,
            role: "read-write"
        }
    });

    if (!groupIDElement) {
        throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
    }

    await ToDoGroup.findByPk(req.body.groupId).then(async (group) => {
        await group?.update({
            title: req.body.title,
            description: req.body.description,
        })
    })

    res.json(OkMessage);
}

export const deleteGroup = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.body.groupId) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    const groupIDElement = await MMUserToDoGroup.findOne({
        where: {
            groupId: req.body.groupId,
            userId: req.user.id,
            role: "read-write"
        }
    });

    if (!groupIDElement) {
        throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
    }

    // Чистка юзеров
    await MMUserToDoGroup.findAll({
        where: {
            groupId: req.body.groupId,
        }
    }).then((userList) => {
        userList.forEach(async (val, _index, _arr) => {
            val.destroy()
        })
    })

    // Чистка тудушек
    await MMToDoToDoGroup.findAll({
        where: {
            groupId: req.body.groupId,
        }
    }).then((taskList) => {
        taskList.forEach(async (val, _index, _arr) => {
            await Task.findByPk(val.taskId).then((task) => {
                task?.destroy()
            })
        })
    })

    res.json(OkMessage);
}
