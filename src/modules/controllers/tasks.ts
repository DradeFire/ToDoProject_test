import { Response } from 'express';
import { TaskRequest } from '../models/models';
import { ErrorReasons, OkMessage, StatusCode } from '../../utils/constants'
import { ErrorResponse } from "../../middleware/custom-error";
import Task from '../../database/model/final/Task';
import MMUserFavouriteToDo from '../../database/model/relations/MMUserFavouriteToDo';
import MMUserToDo from '../../database/model/relations/MMUserToDo';

export const create = async (req: TaskRequest, res: Response) => {
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
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
  });

  if (req.body.favourite) {
    await MMUserFavouriteToDo.create({
      userId: req.user.id,
      taskId: task.id
    });
  } else {
    await MMUserFavouriteToDo.destroy({
      where: {
        userId: req.user.id,
        taskId: task.id
      }
    })
  }

  await MMUserToDo.create({
    userId: req.user.id,
    taskId: task.id
  });

  res.json(task);
};

export const update = async (req: TaskRequest, res: Response) => {
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
    },
  });

  if (!task) {
    throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
  }

  const isUserOwner = await MMUserToDo.findOne({
    where: {
      userId: req.user.id,
      taskId: task.id
    }
  })

  if (!isUserOwner) {
    throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
  }

  await task.update({
    title: req.body.title,
    description: req.body.description,
    isCompleted: req.body.isCompleted,
  });

  if (req.body.favourite) {
    await MMUserFavouriteToDo.create({
      userId: req.user.id,
      taskId: task.id
    });
  } else {
    await MMUserFavouriteToDo.destroy({
      where: {
        userId: req.user.id,
        taskId: task.id
      }
    })
  }

  res.json(OkMessage);
};

export const getAll = async (req: TaskRequest, res: Response) => {
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
};

export const getById = async (req: TaskRequest, res: Response) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!task) {
    throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
  }

  const isUserOwner = await MMUserToDo.findOne({
    where: {
      userId: req.user.id,
      taskId: req.params.id
    }
  })

  if (!isUserOwner) {
    throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
  }

  res.json(task);
};

export const deleteById = async (req: TaskRequest, res: Response) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!task) {
    throw new ErrorResponse(ErrorReasons.TASK_NOT_FOUND_404, StatusCode.NOT_FOUND_404);
  }

  const isUserOwner = await MMUserToDo.findOne({
    where: {
      userId: req.user.id,
      taskId: req.params.id
    }
  })

  if (!isUserOwner) {
    throw new ErrorResponse(ErrorReasons.TOKEN_INCORRECT_403, StatusCode.UNAUTHORIZED_403);
  }

  await task.destroy();

  res.json(OkMessage);
};

export const deleteAll = async (req: TaskRequest, res: Response) => {
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

