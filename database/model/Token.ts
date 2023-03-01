import { DataTypes, Model } from "sequelize";
import { TokenModel } from "../../modules/dto/models";
import { DatabaseInfo } from "../../utils/constants";
import { sequelizeInstance } from "../db/db";
class Token extends Model implements TokenModel {
  userEmail: string | undefined;
  value: string | undefined;
}

Token.init(
  {
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: DatabaseInfo.TOKEN_TABLE_NAME,
  }
);

export {
  Token
};
