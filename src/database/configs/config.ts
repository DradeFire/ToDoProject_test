import { SequelizeOptions } from "sequelize-typescript";

export default {
  dialect: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  models: [__dirname + '/../model/final/*.model.*', __dirname + '/../models/relations/*.model.*'],
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  },
} as SequelizeOptions
