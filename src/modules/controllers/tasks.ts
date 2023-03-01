import Task from "../../database/model/Task";
import { Response } from 'express';
import { TaskRequest } from '../models/models';
import { ErrorReasons, OkMessage, StatusCode } from '../../utils/constants'
import { ErrorResponse } from "../../middleware/custom-error";

const create = async (req: TaskRequest, res: Response) => {
  if (!req.body.title) {
    throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.description) {
    throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.isCompleted) {
    throw new ErrorResponse(ErrorReasons.ISCOMPLITED_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.favourite) {
    throw new ErrorResponse(ErrorReasons.FAVOURITE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }

  const task = await Task.create({
    userEmail: req.token.userEmail,
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
    favourite: req.body.favourite,
  });

  res.json(task);
};

const update = async (req: TaskRequest, res: Response) => {
  if (!req.body.title) {
    throw new ErrorResponse(ErrorReasons.TITLE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.description) {
    throw new ErrorResponse(ErrorReasons.DESCRIPTION_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.isCompleted) {
    throw new ErrorResponse(ErrorReasons.ISCOMPLITED_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }
  if (!req.body.favourite) {
    throw new ErrorResponse(ErrorReasons.FAVOURITE_NOT_SEND_400, StatusCode.BAD_REQUEST_400);
  }

  const task = await Task.findOne({
    where: {
      id: req.params.id,
      userEmail: req.token.userEmail,
    },
  });

  if (!task) {
    throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
  }

  await task.update({
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
    favourite: req.body.favourite,
  });

  res.json(OkMessage);
};

const getAll = async (req: TaskRequest, res: Response) => {
  const taskList = await Task.findAll({
    where: {
      userEmail: req.token.userEmail,
    },
  });

  res.json({ taskList });
};

const getById = async (req: TaskRequest, res: Response) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      userEmail: req.token.userEmail,
    },
  });

  if (!task) {
    throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
  }

  res.json(task);
};

const deleteById = async (req: TaskRequest, res: Response) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      userEmail: req.token.userEmail,
    },
  });

  if (!task) {
    throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
  }

  await task.destroy();

  res.json(OkMessage);
};

const deleteAll = async (req: TaskRequest, res: Response) => {
  await Task.destroy({
    where: {
      userEmail: req.token.userEmail,
    },
  });

  res.json(OkMessage);
};

export {
  create,
  update,
  getAll,
  getById,
  deleteById,
  deleteAll,
};
