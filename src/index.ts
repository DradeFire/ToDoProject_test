import { NestFactory } from "@nestjs/core";
import { initDB } from "./database/db/db";
import { AppModule } from "./modules/module/AppModule";
import CurrentEnv, { Env } from "./utils/env_config";

async function startApp(env: Env) {
    const app = await NestFactory.create(AppModule);
    await initDB();
    await app.listen(5000);
}

startApp(CurrentEnv.env)
