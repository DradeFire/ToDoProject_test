import { Dialect } from "sequelize";

class Config {
  static dialect: Dialect = 'postgres'
  static host = "0.0.0.0" //"db_auth"
  static username = "postgres"
  static password = "1358"
}

export class Dev_Config extends Config {
  static database = "tasktracker_dev"
  static port = 5432
}

export class TEST_Config extends Config {
  static database = "tasktracker_test"
  static port = 5432
}

export class PROD_Config extends Config {
  static database = "tasktracker_prod"
  static port = 5432
}
