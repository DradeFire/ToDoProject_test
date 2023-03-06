import { Module } from '@nestjs/common';
import RequireTokenService from '../../middleware/requireToken';
import TaskController from '../controllers/tasks';

@Module({
    controllers: [TaskController],
    providers: [RequireTokenService],
})
export default class TaskModule { }