import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
    timestamps: false,
    tableName: DatabaseInfo.INVITE_LINK_GROUP_TABLE_NAME
})
export default class InviteLink_Group extends Model {

    @PrimaryKey
    @Column
    public groupId!: number;

    @Column
    public link!: string;

    @Column
    public isEnabled!: boolean;
}