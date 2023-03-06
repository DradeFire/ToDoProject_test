import { Sequelize } from "sequelize-typescript";
import { Dev_Config, PROD_Config, TEST_Config } from "../configs/config";
import CurrentEnv, { Env } from "../../utils/env_config";

function getSequelize(): Sequelize {
  switch (CurrentEnv.env) {
    case Env.DEV: {
      return new Sequelize(
        Dev_Config.database,
        Dev_Config.username,
        Dev_Config.password,
        {
          dialect: Dev_Config.dialect,
          host: Dev_Config.host,
          port: Dev_Config.port,
          models: [__dirname + '/../model/final/*.model.ts', __dirname + '/../models/relations/*.model.ts'],
          modelMatch: (filename, member) => {
            return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
          },
        },
      );
    }
    case Env.PROD: {
      return new Sequelize(
        PROD_Config.database,
        PROD_Config.username,
        PROD_Config.password,
        {
          dialect: PROD_Config.dialect,
          host: PROD_Config.host,
          port: PROD_Config.port,
          models: [__dirname + '../model/final/*.model.*', __dirname + '../models/relations/*.model.*']
        },
      );
    }
    case Env.TEST: {
      return new Sequelize(
        TEST_Config.database,
        TEST_Config.username,
        TEST_Config.password,
        {
          dialect: TEST_Config.dialect,
          host: TEST_Config.host,
          port: TEST_Config.port,
          models: [__dirname + '../model/final/*.model.*', __dirname + '../models/relations/*.model.*']
        },
      );
    }
    default: {
      throw new Error("Unknown exception")
    }
  }
}

const sequelizeInstance = getSequelize();

const initDB = async () => {
  await sequelizeInstance.authenticate(); //Авторизация нашей ORM в БД

  // await sequelizeInstance.dropSchema('public', {});
  // await sequelizeInstance.createSchema('public', {});

  await sequelizeInstance.sync(); //Синхронизация МОДЕЛЕЙ
};

export {
  sequelizeInstance,
  initDB,
};
