import { Table, Column, Model } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
  timestamps: false,
  tableName: DatabaseInfo.USER_FAVOURITE_TASK_TABLE_NAME
})
export default class MMUserFavouriteToDo extends Model {

  @Column
  public userId!: number;

  @Column
  public taskId!: number;
}