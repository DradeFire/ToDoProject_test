export class ErrorReasons {
    static ERROR = "Error";
    static NOT_FOUND_404 = `Not found`;
    static SERVER_ERROR_500 = 'SERVER_ERROR';
    static NO_TOKEN_SEND_403 = "No token send"
    static TOKEN_INCORRECT_403 = "Token incorrect"
    static TASK_NOT_FOUND_404 = "Task not found"
    static INCORRECT_LOGIN_400 = "Incorrect login"
    static INCORRECT_PASSWORD_400 = "Incorrect password"
    static INCORRECT_LAST_PASSWORD_400 = "Incorrect last password"
    static USER_EMAIL_EXIST_400 = "User with this email exist"
    static EMAIL_NOT_SEND_400 = "Email not send"
    static PASSWORD_NOT_SEND_400 = "Password not send"
    static FIRSTNAME_NOT_SEND_400 = "Firstname not send"
    static BIRTHDATE_NOT_SEND_400 = "birthDate not send"
    static TITLE_NOT_SEND_400 = "TItle not send"
    static DESCRIPTION_NOT_SEND_400 = "Description not send"
    static ISCOMPLITED_NOT_SEND_400 = "IsComplited not send"
    static FAVOURITE_NOT_SEND_400 = "Favourite not send"
    static PASSWORDS_NOT_EQUAL_400 = "Passwords not equal"
    static ROLE_NOT_SEND_400 = "Role not send"
    static GROUP_EXIST_400 = "Group with this title exist"
    static GROUP_NOT_FOUND_404 = "Group not found"
    static USER_IN_GROUP_400 = "User already have role in this group"
    static UNKNOWN_ROLE_400 = "Unknown role. Use \"read-only\" or \"read-write\""
    static USER_NOT_IN_GROUP_400 = "User not in group"
    static NOT_OWNER_GROUP_403 = "You aren`t owner this group"
    static USER_NOT_FOUND_404 = "User not found"
    static LINK_DATA_NOT_VALID_400 = "Link data not valid"
}

export class StatusCode {
    static BAD_REQUEST_400 = 400;
    static NOT_FOUND_404 = 404;
    static UNAUTHORIZED_403 = 403;
    static SERVER_ERROR_500 = 500;
}

export class UrlConst {
    // static LOCALHOST_MASK: string = `localhost`;
    static DEV_PORT = 5000;
    static PROD_PORT = 3000
    static HEADER_ACCESS_TOKEN = 'Authorization';
}

export const OkMessage = {
    message: "Ok"
}

export class DatabaseInfo {
    static USER_TABLE_NAME = 'users'
    static TOKEN_TABLE_NAME = 'tokens'
    static TASK_TABLE_NAME = 'tasks'
    static GROUP_TABLE_NAME = 'group'
    static USER_GROUP_TABLE_NAME = 'user_group'
    static USER_TASK_TABLE_NAME = "user_task"
    static USER_FAVOURITE_TASK_TABLE_NAME = "user__favourite_task"
    static USER_FAVOURITE_GROUP_TABLE_NAME = "user__favourite_group"
    static TASK_GROUP_TABLE_NAME = 'user_group'
    static INVITE_LINK_GROUP_TABLE_NAME = 'invite_link_group'
    static INVITE_LINK_TASK_TABLE_NAME = 'invite_link_task'
}

export const JWT_SECRET = "1029384756qpwoeirutyalskdjfhgQWEASDZXC"

export class Transporter {
    static HOST = "smtp.mail.ru"
    static PORT = 465 
    static ISSECURE = true
    static USER = "bajenov-sasha2002@mail.ru"
    static PASS = "4CjuLKictpBCDtegPD9h" //"Pokoets9-6fronder-6furor"
}