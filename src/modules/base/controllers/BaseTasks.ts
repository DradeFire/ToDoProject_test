import jwt from 'jsonwebtoken';
import Task from '../../../database/model/final/Task.model';
import MMUserToDo from '../../../database/model/relations/MMUserToDo.model';
import { ErrorResponse } from '../../../middleware/custom-error';
import { JWT_SECRET, StatusCode } from '../../../utils/constants';

export function getAndCreateTaskInviteLink(taskId: number, role: string): string {
    const secret = JWT_SECRET + taskId
    const payload = {
        taskId: taskId,
        role: role
    }
    const token = jwt.sign(payload, secret)
    return `http://localhost:${process.env.PORT}/api/task/invite/${token}`
}

export async function checkRole(role: string | undefined) {
    switch (role) {
        case "read-only":
        case "read-write":
            break;
        default:
            throw new ErrorResponse("UNKNOWN_ROLE", StatusCode.BAD_REQUEST_400);
    }
}

export async function checkOwner(userId: number, taskId: number) {
    const isUserOwner = await MMUserToDo.findOne({
        where: {
            userId: userId,
            taskId: taskId
        }
    })

    if (!isUserOwner) {
        throw new ErrorResponse("TOKEN_INCORRECT", StatusCode.UNAUTHORIZED_403);
    }
}

export async function checkOwnerWithRole(userId: number, taskId: number, role: string) {
    const isUserOwner = await MMUserToDo.findOne({
        where: {
            userId: userId,
            taskId: taskId,
            role: role
        }
    })

    if (!isUserOwner) {
        throw new ErrorResponse("TOKEN_INCORRECT", StatusCode.UNAUTHORIZED_403);
    }
}

export async function getTaskById(taskId: number): Promise<Task> {
    const task = await Task.findOne({
        where: {
            id: taskId,
        },
    });

    if (!task) {
        throw new ErrorResponse("TASK_NOT_FOUND", StatusCode.NOT_FOUND_404);
    }

    return task!
}

export async function checkGroupRole(groupId: number, userId: number, role: string | undefined) {
    const groupIDElement = await MMUserToDo.findOne({
        where: {
            groupId: groupId,
            userId: userId,
            role: role
        }
    });

    if (!groupIDElement) {
        throw new ErrorResponse("TOKEN_INCORRECT", StatusCode.UNAUTHORIZED_403);
    }
}