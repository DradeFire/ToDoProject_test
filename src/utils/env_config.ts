export enum Env {
    TEST,
    DEV,
    PROD
}

export default class CurrentEnv {
    public static env: Env = Env.PROD 
}