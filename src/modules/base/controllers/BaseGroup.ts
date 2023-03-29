import jwt from 'jsonwebtoken';
import ToDoGroup from '../../../database/model/final/ToDoGroup.model';
import MMUserToDoGroup from '../../../database/model/relations/MMUserToDoGroup.model';
import { ErrorResponse } from '../../../middleware/custom-error';
import { JWT_SECRET, StatusCode } from '../../../utils/constants';

export function getAndCreateGroupInviteLink(groupId: number, role: string): string {
    const secret = JWT_SECRET
    const payload = {
        groupId: groupId,
        role: role
    }
    const token = jwt.sign(payload, secret)
    return `http://localhost:${process.env.PORT as string | undefined}/api/group/invite/${token}`
}

export async function checkRoleIsValid(role: string | undefined) {
    switch (role) {
        case "read-only":
        case "read-write":
            break;
        default:
            throw new ErrorResponse("UNKNOWN_ROLE", StatusCode.BAD_REQUEST_400);
    }
}

export async function checkOwner(userId: number, groupId: number) {
    const isUserOwner = await MMUserToDoGroup.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    })

    if (!isUserOwner) {
        throw new ErrorResponse("TOKEN_INCORRECT", StatusCode.UNAUTHORIZED_403);
    }
}

export async function checkOwnerWithRole(userId: number, taskId: number, role: string) {
    const isUserOwner = await MMUserToDoGroup.findOne({
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

export async function getGroupById(groupId: number): Promise<ToDoGroup> {
    const group = await ToDoGroup.findByPk(groupId);

    if (!group) {
        throw new ErrorResponse("TASK_NOT_FOUND", StatusCode.NOT_FOUND_404);
    }

    return group!
}

export async function checkGroupRole(groupId: number, userId: number, role: string | undefined) {
    const groupIDElement = await MMUserToDoGroup.findOne({
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