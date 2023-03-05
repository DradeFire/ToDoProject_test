import { Table, Column, Model } from "sequelize-typescript";
import { DatabaseInfo } from "../../../utils/constants";

@Table({
    timestamps: false,
    tableName: DatabaseInfo.USER_FAVOURITE_GROUP_TABLE_NAME
})
export default class MMUserFavouriteToDoGroup extends Model {

    @Column
    public groupId!: number;

    @Column
    public userId!: number;
}