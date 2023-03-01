import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../db/db";
import { ToDoModel } from "../../modules/dto/models"
import { DatabaseInfo } from "../../utils/constants";

class Task extends Model implements ToDoModel {
  userEmail: string  | undefined;
  title: string  | undefined;
  description: string  | undefined;
  isCompleted: boolean  | undefined;
  favourite: boolean  | undefined;
  group: string | undefined;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    favourite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    group: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: DatabaseInfo.TASK_TABLE_NAME,
  }
);

export = Task;
