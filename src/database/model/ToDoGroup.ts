import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../db/db";
import { ToDoGroupModel } from "../../modules/dto/models"
import { DatabaseInfo } from "../../utils/constants";

class ToDoGroup extends Model implements ToDoGroupModel {
    title: string | undefined;
    description: string | undefined;
    ownerEmail: string | undefined;
}

ToDoGroup.init(
  {
    title: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: DatabaseInfo.TODO_GROUP_TABLE_NAME,
  }
);

export default ToDoGroup;