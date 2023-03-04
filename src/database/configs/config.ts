import { Dialect } from "sequelize";

class Config {
  static dialect: Dialect = 'postgres'
  static host = "db_auth"
  static username = "postgres"
  static password = "1358"
  static models = [__dirname + '../model/final/*.ts'/*, __dirname + '/models/relations/*.ts'*/]
  static port = 5432
}

export class Dev_Config extends Config {
  static database = "tasktracker_dev"
}

export class TEST_Config extends Config {
  static database = "tasktracker_test"
}

export class PROD_Config extends Config {
  static database = "tasktracker_prod"
}
