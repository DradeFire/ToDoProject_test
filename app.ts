import express, { Application } from "express";
import { authRoutes } from "./routers/auth";
import { taskRoutes } from "./routers/tasks";
import { initDB } from "./database/db/db";
import { Env } from "./utils/env-config";
import { asyncHandler } from "./middleware/asyncHandler";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFoundHandler";
import { requireToken } from "./middleware/requireToken";
import { UrlConst } from "./utils/constants";
import { groupRoutes } from "./routers/group";
import cors from "cors";
import { profileRoutes } from "./routers/profile";

export class App {
  private app: Application;
  private port: number

  constructor(env: Env) {
    this.app = express();

    switch (env) {
      case Env.DEV: {
        this.port = UrlConst.DEV_PORT;
        break;
      }
      case Env.TEST: {
        this.port = UrlConst.DEV_PORT;
        break;
      }
      case Env.PROD: {
        this.port = UrlConst.PROD_PORT;
        break;
      }
    }
  }

  static async create(env: Env): Promise<App> {
    const app = new App(env);

    // await initDB();
    app.initUtils()
    app.initControllers();
    app.initErrorHandling();

    return app;
  }
  
  private initUtils() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.set('view engine', 'ejs')
  }

  private initErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  private initControllers() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/tasks", asyncHandler(requireToken), taskRoutes);
    this.app.use("/api/group", asyncHandler(requireToken), groupRoutes);
    this.app.use("/api/profile", asyncHandler(requireToken), profileRoutes);
  }

  async listen() {
    this.app.listen(this.port, () => console.log(`Server has been started ${this.port}`));
  }

}
