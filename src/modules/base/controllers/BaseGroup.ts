import jwt from 'jsonwebtoken';
import ToDoGroup from '../../../database/model/final/ToDoGroup.model';
import MMUserToDoGroup from '../../../database/model/relations/MMUserToDoGroup.model';
import { ErrorResponse } from '../../../middleware/custom-error';
import { ErrorReasons, JWT_SECRET, StatusCode } from '../../../utils/constants';
import { getCurrentPort } from '../../../utils/env_config';


export default class BaseGroup {
    getAndCreateGroupInviteLink(groupId: number, role: string): string {
        const secret = JWT_SECRET
        const payload = {
            groupId: groupId,
            role: role
        }
        const token = jwt.sign(payload, secret)
        return `http://localhost:${getCurrentPort()}/api/group/invite/${token}`
    }

    async checkRoleIsValid(role: string | undefined) {
        switch (role) {
            case "read-only":
            case "read-write":
                break;
            default:
                throw new ErrorResponse(ErrorReasons.UNKNOWN_ROLE_400, StatusCode.BAD_REQUEST_400);
        }
    }

    async checkOwner(userId: number, groupId: number) {
        const isUserOwner = await MMUserToDoGroup.findOne({
            where: {
                userId: userId,
                groupId: groupId
            }
        })

        if (!isUserOwner) {
            throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
        }
    }

    async checkOwnerWithRole(userId: number, taskId: number, role: string) {
        const isUserOwner = await MMUserToDoGroup.findOne({
            where: {
                userId: userId,
                taskId: taskId,
                role: role
            }
        })

        if (!isUserOwner) {
            throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
        }
    }

    async getGroupById(groupId: number): Promise<ToDoGroup> {
        const group = await ToDoGroup.findByPk(groupId);

        if (!group) {
            throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
        }

        return group!
    }

    async checkGroupRole(groupId: number, userId: number, role: string | undefined) {
        const groupIDElement = await MMUserToDoGroup.findOne({
            where: {
                groupId: groupId,
                userId: userId,
                role: role
            }
        });

        if (!groupIDElement) {
            throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
        }
    }
}
