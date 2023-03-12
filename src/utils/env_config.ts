import { UrlConst } from "./constants";

export enum Env {
    DEV,
    PROD
}

export default class CurrentEnv {
    static env(): Env {
        switch (process.env.ENV) {
            case "DEV": {
                return Env.DEV
            }
            case "PROD": {
                return Env.PROD
            }
            default: {
                throw new Error("Unknown env")
            }
        }
    }
}

export function getCurrentPort(): number {
    switch (CurrentEnv.env()) {
        case Env.DEV: {
            return UrlConst.DEV_PORT;
        }
        case Env.PROD: {
            return UrlConst.PROD_PORT;
        }
    }
}