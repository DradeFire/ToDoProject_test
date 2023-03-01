import { DataTypes, Model } from "sequelize";
import { sequelizeInstance } from "../db/db";
import { RoleGroupModel } from "../../modules/dto/models"
import { DatabaseInfo } from "../../utils/constants";

class RoleGroup extends Model implements RoleGroupModel {
    id: string | undefined;
    userEmail: string | undefined;
    groupTitle: string | undefined;
    role: string | undefined;
}

RoleGroup.init(
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
    groupTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize: sequelizeInstance,
    tableName: DatabaseInfo.ROLE_GROUP_TABLE_NAME,
  }
);

export = RoleGroup;