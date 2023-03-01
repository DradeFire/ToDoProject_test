import { Response } from "express";
import RoleGroup from "../../database/model/RoleGroup";
import ToDoGroup from "../../database/model/ToDoGroup";
import User from "../../database/model/User";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { RoleGroupRequest } from "../models/models";


const addUser = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.groupTitle) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.userEmail) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.role) {
        throw new ErrorResponse(ErrorReasons.ROLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const existUser = await User.findByPk(req.body.userEmail)
    if (!existUser) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    const candidate = await RoleGroup.findOne({
        where: {
            userEmail: req.body.userEmail,
            groupTitle: req.body.groupTitle
        }
    })
    if (candidate) {
        throw new ErrorResponse(ErrorReasons.USER_IN_GROUP_400, StatusCode.BAD_REQUEST_400);
    }

    switch (req.body.role) {
        case "read-only":
        case "read-write":
            break;
        default:
            throw new ErrorResponse(ErrorReasons.UNKNOWN_ROLE_400, StatusCode.BAD_REQUEST_400);
    }

    const owner = await ToDoGroup.findByPk(req.body.groupTitle)
    if (!owner) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (owner.ownerEmail !== req.token.userEmail) {
        throw new ErrorResponse(ErrorReasons.NOT_OWNER_GROUP_403, StatusCode.UNAUTHORIZED_403);
    }

    const user = await RoleGroup.create({
        userEmail: req.body.userEmail,
        groupTitle: req.body.groupTitle,
        role: req.body.role
    })

    res.json(user.toJSON());
}

const updateRole = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.groupTitle) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.userEmail) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.role) {
        throw new ErrorResponse(ErrorReasons.ROLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const existUser = await User.findByPk(req.body.userEmail)
    if (!existUser) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    const candidate = await RoleGroup.findOne({
        where: {
            userEmail: req.body.userEmail,
            groupTitle: req.body.groupTitle
        }
    })
    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_IN_GROUP_400, StatusCode.BAD_REQUEST_400);
    }

    switch (req.body.role) {
        case "read-only":
        case "read-write":
            break;
        default:
            throw new ErrorResponse(ErrorReasons.UNKNOWN_ROLE_400, StatusCode.BAD_REQUEST_400);
    }

    const owner = await ToDoGroup.findByPk(req.body.groupTitle)
    if (!owner) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (owner.ownerEmail !== req.token.userEmail) {
        throw new ErrorResponse(ErrorReasons.NOT_OWNER_GROUP_403, StatusCode.UNAUTHORIZED_403);
    }

    await candidate.update({
        role: req.body.role
    });

    res.json(OkMessage);
}

const deleteUser = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.groupTitle) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.userEmail) {
        throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.role) {
        throw new ErrorResponse(ErrorReasons.ROLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const existUser = await User.findByPk(req.body.userEmail)
    if (!existUser) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    const candidate = await RoleGroup.findOne({
        where: {
            userEmail: req.body.userEmail,
            groupTitle: req.body.groupTitle
        }
    })
    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_IN_GROUP_400, StatusCode.BAD_REQUEST_400);
    }

    switch (req.body.role) {
        case "read-only":
        case "read-write":
            break;
        default:
            throw new ErrorResponse(ErrorReasons.UNKNOWN_ROLE_400, StatusCode.BAD_REQUEST_400);
    }

    const owner = await ToDoGroup.findByPk(req.body.groupTitle)
    if (!owner) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (owner.ownerEmail !== req.token.userEmail) {
        throw new ErrorResponse(ErrorReasons.NOT_OWNER_GROUP_403, StatusCode.UNAUTHORIZED_403);
    }

    await candidate.destroy();

    res.json(OkMessage);
}

const leaveGroup = async (req: RoleGroupRequest, res: Response) => {
    if (!req.body.groupTitle) {
        throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const candidate = await RoleGroup.findOne({
        where: {
            userEmail: req.token.userEmail,
            groupTitle: req.body.groupTitle
        }
    })
    if (!candidate) {
        throw new ErrorResponse(ErrorReasons.USER_NOT_IN_GROUP_400, StatusCode.BAD_REQUEST_400);
    }

    await candidate.destroy();

    res.json(OkMessage);
}

export {
    addUser,
    updateRole,
    deleteUser,
    leaveGroup
}