import { Response } from "express";
import Task from "../../database/model/final/Task.model";
import MMToDoToDoGroup from "../../database/model/relations/MMToDoToDoGroup.model";
import MMUserToDo from "../../database/model/relations/MMUserToDo.model";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup.model";
import { OkMessage } from "../../utils/constants";
import { BaseRequest } from "../base/models/BaseModels";
import { UserModelDto } from "../dto/models";

export const updateProfile = async (req: BaseRequest, res: Response) => {
    const dto: UserModelDto = req.body

    await req.user.update({
        birthDate: dto.birthDate,
        firstName: dto.firstName
    });

    res.json(req.user.toJSON());
}

export const deleteProfile = async (req: BaseRequest, res: Response) => {
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
            // Чистка юзеров
            await MMUserToDoGroup.findAll({
                where: {
                    groupId: val.groupId,
                }
            }).then((userList) => {
                userList.forEach(async (val, _index, _arr) => {
                    val.destroy()
                })
            })

            // Чистка тудушек
            await MMToDoToDoGroup.findAll({
                where: {
                    groupId: val.groupId,
                }
            }).then((taskList) => {
                taskList.forEach(async (val, _index, _arr) => {
                    await Task.findByPk(val.taskId).then((task) => {
                        task?.destroy()
                    })
                })
            })
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
            await Task.findByPk(val.taskId).then((task) => {
                task?.destroy()
            });
        }
    });

    res.json(OkMessage);
}
