import Task from "../../database/model/final/Task.model";
import MMToDoToDoGroup from "../../database/model/relations/MMToDoToDoGroup.model";
import MMUserToDo from "../../database/model/relations/MMUserToDo.model";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup.model";
import { ErrorResponse } from "../../middleware/custom-error";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import { UserRequest } from "../models/models";
import { FastifyReply } from "fastify";

export const updateProfile = async (req: UserRequest, res: FastifyReply) => {
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

    res.status(200).send(OkMessage);
}

export const deleteProfile = async (req: UserRequest, res: FastifyReply) => {
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

    res.status(200).send(OkMessage);
}
