import { Controller, Patch, Delete, Post, Req, Res, UseFilters } from '@nestjs/common';
import { Response } from "express";
import MMUserToDo from "../../database/model/relations/MMUserToDo.model";
import MMUserToDoGroup from "../../database/model/relations/MMUserToDoGroup.model";
import { ErrorResponse } from "../../middleware/custom-error";
import { HttpExceptionFilter } from '../../middleware/errorHandler';
import RequireTokenService from "../../middleware/requireToken";
import { ErrorReasons, OkMessage, StatusCode } from "../../utils/constants";
import BaseGroup from "../base/controllers/BaseGroup";
import { RoleGroupRequest } from "../models/models";

@Controller("/api/group")
@UseFilters(HttpExceptionFilter)
export default class GroupManipulationController extends BaseGroup {

    constructor(private requireTokenService: RequireTokenService) {
        super();
    }

    @Post("/user/")
    async addUser(@Req() req: RoleGroupRequest, @Res() res: Response) {
        await this.requireTokenService.requireToken(req, res)

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

        await this.checkRoleIsValid(req.body.role);

        await MMUserToDoGroup.create({
            userId: req.user.id,
            groupId: req.body.id,
            role: req.body.role
        });

        res.json(OkMessage);
    }

    @Patch("/user/")
    async updateRole(@Req() req: RoleGroupRequest, @Res() res: Response) {
        await this.requireTokenService.requireToken(req, res)

        if (!req.body.id) {
            throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
        }
        if (!req.body.userEmail) {
            throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }
        if (!req.body.role) {
            throw new ErrorResponse(ErrorReasons.ROLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }

        await this.checkOwnerWithRole(req.user.id, req.body.id, "read-write")
        await this.checkRoleIsValid(req.body.role)

        await MMUserToDo.findOne({
            where: {
                userId: req.user.id,
                taskId: req.body.id,
                role: "read-write"
            }
        }).then((val) => {
            val?.update({
                role: req.body.role
            });
        })

        res.json(OkMessage);
    }

    @Delete("/user/")
    async deleteUser(@Req() req: RoleGroupRequest, @Res() res: Response) {
        await this.requireTokenService.requireToken(req, res)

        if (!req.body.userEmail) {
            throw new ErrorResponse(ErrorReasons.EMAIL_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
        }
        if (!req.body.id) {
            throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
        }

        await this.checkOwnerWithRole(req.user.id, req.body.id, "read-write")

        await MMUserToDoGroup.destroy({
            where: {
                userId: req.user.id,
                groupId: req.body.id
            }
        });

        res.json(OkMessage);
    }

    @Delete("/user/me")
    async leaveGroup(@Req() req: RoleGroupRequest, @Res() res: Response) {
        await this.requireTokenService.requireToken(req, res)

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
}


