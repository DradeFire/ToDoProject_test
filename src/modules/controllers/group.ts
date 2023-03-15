import { Response } from "express";
import InviteLink_Group from "../../database/model/final/InviteLink_Group.model";
import Task from "../../database/model/final/Task.model";
import ToDoGroup from "../../database/model/final/ToDoGroup.model";
import MMToDoToDoGroup from "../../database/model/relations/MMToDoToDoGroup.model";
import MMUserFavouriteToDoGroup from "../../database/model/relations/MMUserFavouriteToDoGroup.model";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup.model";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, JWT_SECRET, OkMessage, StatusCode } from "../../utils/constants";
import { ChangeLinkRequest, ToDoGroupRequest } from "../models/models";
import { checkGroupRole, checkOwner, checkRoleIsValid, getAndCreateGroupInviteLink, getGroupById } from "../base/controllers/BaseGroup";
import jwt from 'jsonwebtoken';
import { PayloadGroupLink } from "../dto/models";

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

    const link = getAndCreateGroupInviteLink(group.id, "read-write")

    await InviteLink_Group.create({
        groupId: group.id,
        link: link,
        isEnabled: true
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

    await checkGroupRole(req.body.groupId, req.user.id, "read-write");

    await getGroupById(req.body.groupId)
        .then(async (group) => {
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

    await checkGroupRole(req.body.groupId, req.user.id, "read-write");

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

export const addToFavouriteList = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.params.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await checkOwner(req.user.id, req.params.id);

    await MMUserFavouriteToDoGroup.create({
        userId: req.user.id,
        groupId: req.params.id
    })

    res.json(OkMessage);
}

export const getGroupUserList = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.params.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await checkOwner(req.user.id, req.params.id);

    const userList = await MMUserToDoGroup.findAll({
        where: {
            groupId: req.params.id
        }
    })

    // конвертировать в юзеров

    res.json({ userList });
}


export const getGroupInviteLink = async (req: ToDoGroupRequest, res: Response) => {
    if (!req.params.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await checkGroupRole(req.params.id, req.user.id, "read-write");

    const linkModel = await InviteLink_Group.findByPk(req.params.id);
    if (!linkModel) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    const link = linkModel.link;

    res.json({ link: link });
}

export const updateGroupInviteLink = async (req: ChangeLinkRequest, res: Response) => {
    if (!req.params.id) {
        throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (!req.body.isEnabled) {
        throw new ErrorResponse(ErrorReasons.LINK_DATA_NOT_VALID_400, StatusCode.BAD_REQUEST_400);
    }

    await checkGroupRole(req.params.id, req.user.id, "read-write");

    await checkRoleIsValid(req.body.role);

    await InviteLink_Group.findByPk(req.params.id)
        .then(async (linkInvite) => {
            const link = getAndCreateGroupInviteLink(req.params.id, req.body.role!)

            await linkInvite?.update({
                isEnabled: req.body.isEnabled,
                link: link
            })
        });

    res.json(OkMessage);
}

export const inviteHandler = async (req: ToDoGroupRequest, res: Response) => {
    const secret = JWT_SECRET
    const payload = jwt.verify(req.params.token, secret)

    await MMUserToDoGroup.create({
        userId: req.user.id,
        groupId: (payload as PayloadGroupLink).groupId,
        role: (payload as PayloadGroupLink).role
    });

    res.json(OkMessage);
}