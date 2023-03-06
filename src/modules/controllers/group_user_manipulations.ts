import { Response } from "express";
import MMUserToDo from "../../database/model/relations/MMUserToDo.model";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup.model";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { checkOwnerWithRole, checkRoleIsValid } from "../base/controllers/BaseGroup";
import { RoleGroupRequest } from "../models/models";


export const addUser = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (!req.body.userEmail) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.role) {
        throw new ErrorResponse(ErrorReasons.ROLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const existUser = await MMUserToDoGroup.findOne({
        where: {
            userId: req.user.id,
            groupId: req.body.id,
            role: "read-write"
        }
    });
    if (existUser) {
        throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.NOT_FOUND_404);
    }

    await checkRoleIsValid(req.body.role);

    await MMUserToDoGroup.create({
        userId: req.user.id,
        groupId: req.body.id,
        role: req.body.role
    });

    res.json(OkMessage);
}

export const updateRole = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (!req.body.userEmail) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.role) {
        throw new ErrorResponse(ErrorReasons.ROLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    await checkOwnerWithRole(req.user.id, req.body.id, "read-write")
    await checkRoleIsValid(req.body.role)

    await MMUserToDo.findOne({
        where: {
            userId: req.user.id,
            taskId: req.body.id,
            role: "read-write"
        }
    }).then((val) => {
        val?.update({
            role: req.body.role
        });
    })

    res.json(OkMessage);
}

export const deleteUser = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.userEmail) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await checkOwnerWithRole(req.user.id, req.body.id, "read-write")

    await MMUserToDoGroup.destroy({
        where: {
            userId: req.user.id,
            groupId: req.body.id
        }
    });

    res.json(OkMessage);
}

export const leaveGroup = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await MMUserToDoGroup.destroy({
        where: {
            userId: req.user.id,
            groupId: req.body.id
        }
    });

    res.json(OkMessage);
}
