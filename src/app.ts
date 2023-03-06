import { authRoutes } from "./routers/auth";
import { taskRoutes } from "./routers/tasks";
import { initDB } from "./database/db/db";
import { Env } from "./utils/env_config";
import { UrlConst } from "./utils/constants";
import groupRoutes from "./routers/group";
import { profileRoutes } from "./routers/profile";
import { notFound } from "./middleware/notFoundHandler";
import { errorHandler } from "./middleware/errorHandler";
import { requireToken } from "./middleware/requireToken";
import { asyncHandler } from "./middleware/asyncHandler";
import Fastify, { FastifyInstance } from "fastify";
import cors from '@fastify/cors'
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import ejs from "@fastify/view";

export default class App {
  readonly app: FastifyInstance;
  private port: number

  constructor(env: Env) {
    this.app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

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

    await initDB();
    app.initUtils()
    app.initControllers();
    app.initErrorHandling();

    return app;
  }

  private initUtils() {
    this.app.register(cors);
    this.app.register(ejs, {
      engine: {
        ejs: require("ejs"),
      },
    });
  }

  private initErrorHandling() {
    this.app.setNotFoundHandler(notFound);
    this.app.setErrorHandler(errorHandler);
  }

  private initControllers() {
    authRoutes(this.app);
    this.app.route({ url: "/api/task", preHandler: asyncHandler(requireToken), handler: taskRoutes, schema: {}, method: ['DELETE', 'GET', 'PATCH', 'POST'] });
    this.app.route({ url: "/api/group", preHandler: asyncHandler(requireToken), handler: groupRoutes, schema: {}, method: ['DELETE', 'GET', 'PATCH', 'POST'] });
    this.app.route({ url: "/api/profile", preHandler: asyncHandler(requireToken), handler: profileRoutes, schema: {}, method: ['DELETE', 'GET', 'PATCH', 'POST'] });
  }

  async listen() {
    this.app.listen({ port: this.port }, () => console.log(`Server has been started ${this.port}`));
  }

}
