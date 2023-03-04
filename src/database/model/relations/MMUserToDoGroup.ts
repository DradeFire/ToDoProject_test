import { Table, Column, Model } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
  timestamps: false,
  tableName: DatabaseInfo.USER_GROUP_TABLE_NAME
})
export default class MMUserToDoGroup extends Model {

  @Column
  public userId!: number;

  @Column
  public groupId!: number;

  @Column
  public role!: string;
}