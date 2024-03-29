import express, { Application } from "express";
import { authRoutes } from "./routers/auth";
import { taskRoutes } from "./routers/tasks";
import { initDB } from "./database/db/db";
import groupRoutes from "./routers/group";
import { profileRoutes } from "./routers/profile";
import { notFound } from "./middleware/notFoundHandler";
import { errorHandler } from "./middleware/errorHandler";
import { requireToken } from "./middleware/requireToken";
import { asyncHandler } from "./middleware/asyncHandler";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

export default class App {
  private app: Application;
  private port: number

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT!)
  }

  static async create(): Promise<App> {
    const app = new App();

    await initDB();
    app.initUtils()
    app.initControllers();
    app.initErrorHandling();

    return app;
  }

  private initUtils() {
    // this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.set('view engine', 'ejs')
  }

  private initErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  private initControllers() {
    this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/task", asyncHandler(requireToken), taskRoutes);
    this.app.use("/api/group", asyncHandler(requireToken), groupRoutes);
    this.app.use("/api/profile", asyncHandler(requireToken), profileRoutes);
  }

  async listen() {
    this.app.listen(this.port, () => {
      console.log(`Server has been started ${this.port}`)
    });
  }

}
