import { DatabaseInfo } from "../../../utils/constants";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: DatabaseInfo.GROUP_TABLE_NAME
})
export default class ToDoGroup extends Model {

  @Column
  public title!: string;

  @Column
  public description!: string;
}
