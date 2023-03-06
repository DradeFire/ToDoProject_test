import { Response } from 'express';
import { ChangeLinkRequest, TaskRequest } from '../models/models';
import { ErrorReasons, JWT_SECRET, OkMessage, StatusCode } from '../../utils/constants'
import { ErrorResponse } from "../../middleware/custom-error";
import Task from '../../database/model/final/Task.model';
import MMUserFavouriteToDo from '../../database/model/relations/MMUserFavouriteToDo.model';
import MMUserToDo from '../../database/model/relations/MMUserToDo.model';
import InviteLink_Task from '../../database/model/final/InviteLink_Task.model';
import jwt from 'jsonwebtoken';
import { PayloadTaskLink } from '../dto/models';
import BaseTasks from '../base/controllers/BaseTasks';
import RequireTokenService from '../../middleware/requireToken';
import { Controller, Get, Post, Req, Res, Patch, Delete, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../middleware/errorHandler';

@Controller("/api/task")
@UseFilters(HttpExceptionFilter)
export default class TaskController extends BaseTasks {

  constructor(private requireTokenService: RequireTokenService) {
    super();
  }

  @Get()
  async getAll(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    const idList = await MMUserToDo.findAll({
      where: {
        userId: req.user.id
      }
    })

    const taskList = Array<Task>(idList.length)

    idList.forEach(async (val, index, _arr) => {
      const tmp = await Task.findByPk(val.taskId);
      taskList[index] = tmp!;
    });

    res.json({ taskList });
  }

  @Get("/:id")
  async getById(@Req() req: TaskRequest, @Res() res: Response) {
    const task = await this.getTaskById(req.params.id)
    res.json(task);
  }

  @Get("/user-list/:id")
  async getTaskUserList(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    if (!req.params.id) {
      throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await this.checkOwner(req.user.id, req.params.id);

    const userList = await MMUserToDo.findAll({
      where: {
        taskId: req.params.id
      }
    })

    // TODO: конвертировать в юзеров

    res.json({ userList });
  }

  @Get("/invite-link/:id")
  async getTaskInviteLink(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    if (!req.params.id) {
      throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await this.checkGroupRole(req.params.id, req.user.id, "read-write");

    const linkModel = await InviteLink_Task.findByPk(req.params.id);
    if (!linkModel) {
      throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    const link = linkModel.link;

    res.json({ link: link });
  }

  @Get("/invite/:token")
  async inviteHandler(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    const secret = JWT_SECRET
    const payload = jwt.verify(req.params.token, secret)

    await MMUserToDo.create({
      userId: req.user.id,
      taskId: (payload as PayloadTaskLink).taskId,
      role: (payload as PayloadTaskLink).role
    });

    res.json(OkMessage);
  }

  @Post()
  async create(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    if (!req.body.title) {
      throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.description) {
      throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.isCompleted) {
      throw new ErrorResponse(ErrorReasons.ISCOMPLITED_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted,
    });

    await MMUserToDo.create({
      userId: req.user.id,
      taskId: task.id
    });


    const link = this.getAndCreateTaskInviteLink(task.id, "read-write")

    await InviteLink_Task.create({
      groupId: task.id as number,
      link: link,
      isEnabled: true
    });

    res.json(task.toJSON());
  }

  @Post("/favourite/:id")
  async addToFavouriteList(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    if (!req.params.id) {
      throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }

    await this.checkOwner(req.user.id, req.params.id);

    await MMUserFavouriteToDo.create({
      userId: req.user.id,
      taskId: req.params.id
    })

    res.json(OkMessage);
  }

  @Patch("/:id")
  async update(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    if (!req.body.title) {
      throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.description) {
      throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }
    if (!req.body.isCompleted) {
      throw new ErrorResponse(ErrorReasons.ISCOMPLITED_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
    }

    const task = await this.getTaskById(req.params.id);

    await this.checkOwnerWithRole(req.user.id, task.id, "read-write")

    await task.update({
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted,
    });

    res.json(OkMessage);
  }

  @Patch("/invite-link/:id")
  async updateTaskInviteLink(@Req() req: ChangeLinkRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    if (!req.params.id) {
      throw new ErrorResponse(ErrorReasons.GROUP_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
    }
    if (!req.body.isEnabled) {
      throw new ErrorResponse(ErrorReasons.LINK_DATA_NOT_VALID_400, StatusCode.BAD_REQUEST_400);
    }

    await this.checkGroupRole(req.params.id, req.user.id, "read-write");

    await this.checkRole(req.body.role)

    await InviteLink_Task.findByPk(req.params.id)
      .then(async (linkInvite) => {
        const link = this.getAndCreateTaskInviteLink(req.params.id, req.body.role!)

        await linkInvite?.update({
          isEnabled: req.body.isEnabled,
          link: link
        })
      });

    res.json(OkMessage);
  }

  @Delete()
  async deleteAll(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    const idList = await MMUserToDo.findAll({
      where: {
        userId: req.user.id
      }
    })

    idList.forEach(async (val, _index, _arr) => {
      const task = await Task.findByPk(val.taskId);
      task?.destroy();
    });

    res.json(OkMessage);
  }

  @Delete("/:id")
  async deleteById(@Req() req: TaskRequest, @Res() res: Response) {
    await this.requireTokenService.requireToken(req, res)

    const task = await this.getTaskById(req.params.id)

    await this.checkOwnerWithRole(req.user.id, req.params.id, "read-write")

    await task.destroy();

    res.json(OkMessage);
  }

}
