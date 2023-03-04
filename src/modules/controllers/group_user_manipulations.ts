import { Response } from "express";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
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

    switch (req.body.role) {
        case "read-only":
        case "read-write":
            break;
        default:
            throw new ErrorResponse(ErrorReasons.UNKNOWN_ROLE_400, StatusCode.BAD_REQUEST_400);
    }

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

    const existUser = await MMUserToDoGroup.findOne({
        where: {
            userId: req.user.id,
            groupId: req.body.id,
            role: "read-write"
        }
    });
    if (!existUser) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    switch (req.body.role) {
        case "read-only":
        case "read-write":
            break;
        default:
            throw new ErrorResponse(ErrorReasons.UNKNOWN_ROLE_400, StatusCode.BAD_REQUEST_400);
    }

    await existUser.update({
        role: req.body.role
    });

    res.json(OkMessage);
}

export const deleteUser = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.userEmail) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const existUser = await MMUserToDoGroup.findOne({
        where: {
            userId: req.user.id,
            groupId: req.body.id,
            role: "read-write"
        }
    });
    if (!existUser) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

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
