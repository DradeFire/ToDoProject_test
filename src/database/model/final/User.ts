import { Column, DataType, Model, Table } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
  timestamps: false,
  tableName: DatabaseInfo.USER_TABLE_NAME
})
export default class User extends Model {

  @Column({
    allowNull: false,
    unique: true
  })
  public email!: string;

  @Column({
    allowNull: false,
  })
  public pass!: string;

  @Column({
    allowNull: false,
  })
  public firstName!: string;

  @Column({
    allowNull: false,
  })
  public birthDate!: string;
}
