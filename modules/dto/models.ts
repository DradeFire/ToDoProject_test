export interface UserModel {
    email: string | undefined
    pass: string | undefined
    firstName: string | undefined
}

export interface ToDoModel {
    userEmail: string | undefined
    title: string | undefined
    description: string | undefined
    isCompleted: boolean | undefined
    favourite: boolean | undefined
    group: string | undefined
}

export interface TokenModel {
    userEmail: string | undefined
    value: string | undefined
}

export interface ChangePassModel {
    lastPassword: string | undefined
    newPassword: string | undefined
}

export interface RecoverPassModel {
    email: string | undefined
    password: string | undefined
    againPassword: string | undefined
}

export interface IdParamModel {
    email: string
    id: number
    token: string
}

export interface RoleGroupModel {
    id: string | undefined
    userEmail: string | undefined
    groupTitle: string | undefined
    role: string | undefined
}

export interface ToDoGroupModel {
    title: string | undefined
    description: string | undefined
    ownerEmail: string | undefined
}
