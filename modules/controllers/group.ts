import { Response } from "express";
import RoleGroup from "../../database/model/RoleGroup";
import Task from "../../database/model/Task";
import ToDoGroup from "../../database/model/ToDoGroup";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { ToDoGroupRequest } from "../models/models";


const createGroup = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.body.title) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.description) {
        throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const candidate = await ToDoGroup.findByPk(req.body.title);
    if (candidate) {
        throw new ErrorResponse(ErrorReasons.GROUP_EXIST_400, StatusCode.BAD_REQUEST_400);
    }

    const group = await ToDoGroup.create({
        title: req.body.title,
        description: req.body.description,
        ownerEmail: req.body.ownerEmail
    });
    res.json(group.toJSON());
}

const updateGroup = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.body.title) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.description) {
        throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const owner = await ToDoGroup.findByPk(req.body.title)
    if (!owner) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (owner.ownerEmail !== req.token.userEmail) {
        throw new ErrorResponse(ErrorReasons.NOT_OWNER_GROUP_403, StatusCode.UNAUTHORIZED_403);
    }

    owner.update({
        title: req.body.title,
        description: req.body.description,
    })

    res.json(OkMessage);
}

const deleteGroup = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.body.title) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.description) {
        throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const owner = await ToDoGroup.findByPk(req.body.title)
    if (!owner) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (owner.ownerEmail !== req.token.userEmail) {
        throw new ErrorResponse(ErrorReasons.NOT_OWNER_GROUP_403, StatusCode.UNAUTHORIZED_403);
    }

    await ToDoGroup.destroy({
        where: {
            title: req.body.title
        },
    });

    await Task.destroy({
        where: {
            group: req.body.title
        },
    });

    await RoleGroup.destroy({
        where: {
            groupTitle: req.body.title
        },
    });

    res.json(OkMessage);
}

export {
    createGroup,
    updateGroup,
    deleteGroup
}