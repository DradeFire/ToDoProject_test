import { UrlConst } from "./constants";

export enum Env {
    TEST,
    DEV,
    PROD
}

export default class CurrentEnv {
    public static env: Env = Env.DEV
}

export function getCurrentPort(): number {
    switch (CurrentEnv.env) {
        case Env.DEV: {
            return UrlConst.DEV_PORT;
        }
        case Env.TEST: {
            return UrlConst.DEV_PORT;
        }
        case Env.PROD: {
            return UrlConst.PROD_PORT;
        }
    }
}