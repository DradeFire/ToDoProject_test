import { Table, Column, Model } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
  timestamps: false,
  tableName: DatabaseInfo.TASK_GROUP_TABLE_NAME
})
export default class MMToDoToDoGroup extends Model {

  @Column
  public groupId!: number;

  @Column
  public taskId!: number;
}