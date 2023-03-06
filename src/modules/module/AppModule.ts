import { Module } from '@nestjs/common';
import GroupModule from './GroupModule';
import TaskModule from './TaskModule';
import UserModule from './UserModule';

@Module({
    imports: [TaskModule, GroupModule, UserModule],
})
export class AppModule { }