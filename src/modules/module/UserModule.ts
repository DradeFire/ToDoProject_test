import { Module } from '@nestjs/common';
import RequireTokenService from '../../middleware/requireToken';
import AuthController from "../controllers/auth";
import PassController from "../controllers/pass";
import ProfileController from "../controllers/profile";

@Module({
    controllers: [AuthController, PassController, ProfileController],
    providers: [RequireTokenService],
})
export default class UserModule { }