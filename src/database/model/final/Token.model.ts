import { DatabaseInfo } from "../../../utils/constants";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: DatabaseInfo.TOKEN_TABLE_NAME
})
export default class Token extends Model {

  @Column({
    allowNull: false,
    unique: true
  })
  public value!: string;

  @Column({
    allowNull: false,
  })
  public userEmail!: string;
}
