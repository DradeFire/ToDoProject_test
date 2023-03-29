import { Sequelize } from "sequelize-typescript";
import config from "../configs/config";

const sequelizeInstance = new Sequelize(config);

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
