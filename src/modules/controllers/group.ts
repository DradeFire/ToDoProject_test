import { Response } from "express";
import InviteLink_Group from "../../database/model/final/InviteLink_Group.model";
import Task from "../../database/model/final/Task.model";
import ToDoGroup from "../../database/model/final/ToDoGroup.model";
import MMToDoToDoGroup from "../../database/model/relations/MMToDoToDoGroup.model";
import MMUserFavouriteToDoGroup from "../../database/model/relations/MMUserFavouriteToDoGroup.model";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup.model";
import { ErrorResponse } from "../../middleware/custom-error";
import { JWT_SECRET, OkMessage, StatusCode } from "../../utils/constants";
import { checkGroupRole, checkOwner, checkRoleIsValid, getAndCreateGroupInviteLink, getGroupById } from "../base/controllers/BaseGroup";
import jwt from 'jsonwebtoken';
import { ChangeLinkModelDto, PayloadGroupLinkDto, ToDoGroupModelDto } from "../dto/models";
import { BaseRequest } from "../base/models/BaseModels";

export const createGroup = async (req: BaseRequest, res: Response) => {
    const dto: ToDoGroupModelDto = req.body

    const candidate = await ToDoGroup.findOne({
        where: {
            title: dto.title
        }
    });
    if (candidate) {
        throw new ErrorResponse("GROUP_EXIST", StatusCode.BAD_REQUEST_400);
    }

    const group = await ToDoGroup.create({
        title: dto.title,
        description: dto.description
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

export const updateGroup = async (req: BaseRequest, res: Response) => {
    const dto: ToDoGroupModelDto = req.body

    await checkGroupRole(dto.groupId, req.user.id, "read-write");

    await getGroupById(dto.groupId)
        .then(async (group) => {
            await group?.update({
                title: dto.title,
                description: dto.description,
            })
        })

    res.json(OkMessage);
}

export const deleteGroup = async (req: BaseRequest, res: Response) => {
    const dto: ToDoGroupModelDto = req.body

    await checkGroupRole(dto.groupId, req.user.id, "read-write");

    // Чистка юзеров
    await MMUserToDoGroup.findAll({
        where: {
            groupId: dto.groupId,
        }
    }).then((userList) => {
        userList.forEach(async (val, _index, _arr) => {
            val.destroy()
        })
    })

    // Чистка тудушек
    await MMToDoToDoGroup.findAll({
        where: {
            groupId: dto.groupId,
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

export const addToFavouriteList = async (req: BaseRequest, res: Response) => {
    const id = Number(req.params.id)

    await checkOwner(req.user.id, id!);

    await MMUserFavouriteToDoGroup.create({
        userId: req.user.id,
        groupId: id
    })

    res.json(OkMessage);
}

export const getGroupUserList = async (req: BaseRequest, res: Response) => {
    const id = Number(req.params.id)

    await checkOwner(req.user.id, id!);

    const userList = await MMUserToDoGroup.findAll({
        where: {
            groupId: id
        }
    })

    // конвертировать в юзеров

    res.json({ userList });
}


export const getGroupInviteLink = async (req: BaseRequest, res: Response) => {
    const id = Number(req.params.id)

    await checkGroupRole(id, req.user.id, "read-write");

    const linkModel = await InviteLink_Group.findByPk(id);
    if (!linkModel) {
        throw new ErrorResponse("GROUP_NOT_FOUND", StatusCode.NOT_FOUND_404);
    }

    const link = linkModel.link;

    res.json({ link: link });
}

export const updateGroupInviteLink = async (req: BaseRequest, res: Response) => {
    const id = Number(req.params.id)
    const dto: ChangeLinkModelDto = req.body

    await checkGroupRole(id, req.user.id, "read-write");

    await checkRoleIsValid(dto.role);

    await InviteLink_Group.findByPk(id)
        .then(async (linkInvite) => {
            const link = getAndCreateGroupInviteLink(id, dto.role!)

            await linkInvite?.update({
                isEnabled: dto.isEnabled,
                link: link
            })
        });

    res.json(OkMessage);
}

export const inviteHandler = async (req: BaseRequest, res: Response) => {
    const secret = JWT_SECRET
    const payload = jwt.verify(req.params.token, secret)

    await MMUserToDoGroup.create({
        userId: req.user.id,
        groupId: (payload as PayloadGroupLinkDto).groupId,
        role: (payload as PayloadGroupLinkDto).role
    });

    res.json(OkMessage);
}