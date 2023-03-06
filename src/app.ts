import express, { Application } from "express";
import { initDB } from "./database/db/db";
import { Env } from "./utils/env_config";
import { UrlConst } from "./utils/constants";
import cors from "cors";

export default class App {
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

    await initDB();
    app.initUtils()

    return app;
  }
  
  private initUtils() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.set('view engine', 'ejs')
  }


  async listen() {
    this.app.listen(this.port, () => console.log(`Server has been started ${this.port}`));
  }

}
