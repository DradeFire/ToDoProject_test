import { Response } from 'express';
import { JWT_SECRET, OkMessage, StatusCode } from '../../utils/constants'
import { ErrorResponse } from "../../middleware/custom-error";
import Task from '../../database/model/final/Task.model';
import MMUserFavouriteToDo from '../../database/model/relations/MMUserFavouriteToDo.model';
import MMUserToDo from '../../database/model/relations/MMUserToDo.model';
import InviteLink_Task from '../../database/model/final/InviteLink_Task.model';
import { checkGroupRole, checkOwner, checkOwnerWithRole, checkRole, getAndCreateTaskInviteLink, getTaskById } from '../base/controllers/BaseTasks';
import jwt from 'jsonwebtoken';
import { ChangeLinkModelDto, PayloadTaskLinkDto, ToDoModelDto } from '../dto/models';
import { BaseRequest } from '../base/models/BaseModels';

export const create = async (req: BaseRequest, res: Response) => {
  const dto: ToDoModelDto = req.body

  const task = await Task.create({
    title: dto.title,
    description: dto.description,
    isCompleted: dto.isCompleted,
  });

  await MMUserToDo.create({
    userId: req.user.id,
    taskId: task.id
  });


  const link = getAndCreateTaskInviteLink(task.id, "read-write")

  await InviteLink_Task.create({
    groupId: task.id as number,
    link: link,
    isEnabled: true
  });

  res.json(task.toJSON());
};

export const update = async (req: BaseRequest, res: Response) => {
  const dto: ToDoModelDto = req.body
  const id = Number(req.params.id)

  const task = await getTaskById(id);

  await checkOwnerWithRole(req.user.id, task.id, "read-write")

  await task.update({
    title: dto.title,
    description: dto.description,
    isCompleted: dto.isCompleted,
  });

  res.json(OkMessage);
};

export const getAll = async (req: BaseRequest, res: Response) => {
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

  res.json(taskList);
};

export const getById = async (req: BaseRequest, res: Response) => {
  const task = await getTaskById(Number(req.params.id))
  res.json(task);
};

export const deleteById = async (req: BaseRequest, res: Response) => {
  const id = Number(req.params.id)

  const task = await getTaskById(id)

  await checkOwnerWithRole(req.user.id, id, "read-write")

  await task.destroy();

  res.json(OkMessage);
};

export const deleteAll = async (req: BaseRequest, res: Response) => {
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
};

export const addToFavouriteList = async (req: BaseRequest, res: Response) => {
  const id = Number(req.params.id)

  await checkOwner(req.user.id, id);

  await MMUserFavouriteToDo.create({
    userId: req.user.id,
    taskId: id
  })

  res.json(OkMessage);
}

export const getTaskUserList = async (req: BaseRequest, res: Response) => {
  const id = Number(req.params.id)

  await checkOwner(req.user.id, id);

  const userList = await MMUserToDo.findAll({
    where: {
      taskId: id
    }
  })

  // TODO: конвертировать в юзеров

  res.json({ userList });
}

export const getTaskInviteLink = async (req: BaseRequest, res: Response) => {
  const id = Number(req.params.id)

  await checkGroupRole(id, req.user.id, "read-write");

  const linkModel = await InviteLink_Task.findByPk(id);
  if (!linkModel) {
    throw new ErrorResponse("TASK_NOT_FOUND", StatusCode.NOT_FOUND_404);
  }

  const link = linkModel.link;

  res.json({ link: link });
}

export const updateTaskInviteLink = async (req: BaseRequest, res: Response) => {
  const dto: ChangeLinkModelDto = req.body
  const id = Number(req.params.id)

  await checkGroupRole(id, req.user.id, "read-write");

  await checkRole(dto.role)

  await InviteLink_Task.findByPk(id)
    .then(async (linkInvite) => {
      const link = getAndCreateTaskInviteLink(id, dto.role)

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

  await MMUserToDo.create({
    userId: req.user.id,
    taskId: (payload as PayloadTaskLinkDto).taskId,
    role: (payload as PayloadTaskLinkDto).role
  });

  res.json(OkMessage);
}
