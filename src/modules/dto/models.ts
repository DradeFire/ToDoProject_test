import { IsString, IsBoolean, IsNumber} from "class-validator"

export class UserModelDto {
    @IsString()
    email!: string
    @IsString()
    pass!: string
    @IsString()
    firstName!: string
    @IsString()
    birthDate!: string
}

export class ToDoModelDto {
    @IsString()
    title!: string
    @IsString()
    description!: string
    @IsBoolean()
    isCompleted!: boolean
}

export class TokenModelDto {
    @IsString()
    userEmail!: string 
    @IsString()
    value!: string
}

export class ChangePassModelDto {
    @IsString()
    lastPassword!: string
    @IsString()
    newPassword!: string
}

export class RecoverPassModelDto {
    @IsString()
    email!: string
    @IsString()
    password!: string
    @IsString()
    againPassword!: string
}

export class RoleGroupModelDto {
    @IsNumber()
    id!: number
    @IsString()
    userEmail!: string
    @IsString()
    groupTitle!: string
    @IsString()
    role!: string
}

export class ToDoGroupModelDto {
    @IsNumber()
    groupId!: number
    @IsString()
    title!: string
    @IsString()
    description!: string
    @IsString()
    ownerEmail!: string
}

export class ChangeLinkModelDto {
    @IsString()
    role!: string 
    @IsBoolean()
    isEnabled!: boolean 
}

export class PayloadTaskLinkDto {
    @IsString()
    taskId!: string
    @IsString()
    role!: string
}

export class PayloadGroupLinkDto {
    @IsString()
    groupId!: string
    @IsString()
    role!: string
}

export class PayloadResetPassDto {
    @IsString()
    email!: string
    @IsString()
    firstName!: string
}