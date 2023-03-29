import { Response } from "express";
import MMUserToDo from "../../database/model/relations/MMUserToDo.model";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup.model";
import { ErrorResponse } from "../../middleware/custom-error";
import { OkMessage, StatusCode } from "../../utils/constants";
import { checkOwnerWithRole, checkRoleIsValid } from "../base/controllers/BaseGroup";
import { BaseRequest } from "../base/models/BaseModels";
import { RoleGroupModelDto } from "../dto/models";


export const addUser = async (req: BaseRequest, res: Response) => {
    const dto: RoleGroupModelDto = req.body

    const existUser = await MMUserToDoGroup.findOne({
        where: {
            userId: req.user.id,
            groupId: dto.id,
            role: "read-write"
        }
    });
    if (existUser) {
        throw new ErrorResponse("USER_EMAIL_EXIST", StatusCode.NOT_FOUND_404);
    }

    await checkRoleIsValid(dto.role);

    await MMUserToDoGroup.create({
        userId: req.user.id,
        groupId: dto.id,
        role: dto.role
    });

    res.json(OkMessage);
}

export const updateRole = async (req: BaseRequest, res: Response) => {
    const dto: RoleGroupModelDto = req.body

    await checkOwnerWithRole(dto.id, dto.id, "read-write")
    await checkRoleIsValid(dto.role)

    await MMUserToDo.findOne({
        where: {
            userId: dto.id,
            taskId: dto.id,
            role: "read-write"
        }
    }).then((val) => {
        val?.update({
            role: dto.role
        });
    })

    res.json(OkMessage);
}

export const deleteUser = async (req: BaseRequest, res: Response) => {
    const dto: RoleGroupModelDto = req.body

    await checkOwnerWithRole(req.user.id, dto.id, "read-write")

    await MMUserToDoGroup.destroy({
        where: {
            userId: req.user.id,
            groupId: dto.id
        }
    });

    res.json(OkMessage);
}

export const leaveGroup = async (req: BaseRequest, res: Response) => {
    const dto: RoleGroupModelDto = req.body

    await MMUserToDoGroup.destroy({
        where: {
            userId: req.user.id,
            groupId: dto.id
        }
    });

    res.json(OkMessage);
}
