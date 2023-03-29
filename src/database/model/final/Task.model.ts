import { Table, Column, Model } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
  timestamps: false,
  tableName: DatabaseInfo.TASK_TABLE_NAME
})
export default class Task extends Model {

  @Column
  public title!: string;

  @Column
  public description!: string;

  @Column
  public isCompleted!: boolean;
}
