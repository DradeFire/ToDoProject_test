import { Module } from '@nestjs/common';
import RequireTokenService from '../../middleware/requireToken';
import GroupController from '../controllers/group';
import GroupManipulationController from '../controllers/group_user_manipulations';

@Module({
    controllers: [GroupController, GroupManipulationController],
    providers: [RequireTokenService],
})
export default class GroupModule { }