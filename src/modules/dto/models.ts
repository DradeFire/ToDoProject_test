export class UserModel {
    email: string | undefined
    pass: string | undefined
    firstName: string | undefined
    birthDate: string | undefined
}

export class ToDoModel {
    title: string | undefined
    description: string | undefined
    isCompleted: boolean | undefined
}

export class TokenModel {
    userEmail: string | undefined
    value: string | undefined
}

export class ChangePassModel {
    lastPassword: string | undefined
    newPassword: string | undefined
}

export class RecoverPassModel {
    email: string | undefined
    password: string | undefined
    againPassword: string | undefined
}

export class IdParamModel {
    email!: string
    id!: number
    token!: string
}

export class RoleGroupModel {
    id: number | undefined
    userEmail: string | undefined
    groupTitle: string | undefined
    role: string | undefined
}

export class ToDoGroupModel {
    groupId: number | undefined
    title: string | undefined
    description: string | undefined
    ownerEmail: string | undefined
}

export class ChangeLinkModel {
    role: string | undefined
    isEnabled: boolean | undefined
}

export class PayloadTaskLink {
    taskId!: string
    role!: string
}

export class PayloadGroupLink {
    groupId!: string
    role!: string
}

export class PayloadResetPass {
    email!: string
    firstName!: string
}