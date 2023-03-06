import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
    timestamps: false,
    tableName: DatabaseInfo.INVITE_LINK_TASK_TABLE_NAME
})
export default class InviteLink_Task extends Model {

    @PrimaryKey
    @Column
    public taskId!: number;

    @Column
    public link!: string;

    @Column
    public isEnabled!: boolean;
}