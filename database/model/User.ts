import { sequelizeInstance } from "../db/db";
import { DataTypes, Model } from "sequelize";
import { UserModel } from "../../modules/dto/models"
import { DatabaseInfo } from "../../utils/constants";

class User extends Model implements UserModel {
  email: string | undefined;
  pass: string | undefined;
  firstName: string | undefined;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: DatabaseInfo.USER_TABLE_NAME,
  }
);

export = User;