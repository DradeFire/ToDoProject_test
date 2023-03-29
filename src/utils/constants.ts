export const StatusCode = {
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    UNAUTHORIZED_403: 403,
    SERVER_ERROR_500: 500
}

export const UrlConst = {
    // static LOCALHOST_MASK: string = `localhost`;
    HEADER_ACCESS_TOKEN: 'Authorization'
}

export const OkMessage = {
    message: "Ok"
}

export const DatabaseInfo = {
    USER_TABLE_NAME: 'users',
    TOKEN_TABLE_NAME: 'tokens',
    TASK_TABLE_NAME: 'tasks',
    GROUP_TABLE_NAME: 'group',
    USER_GROUP_TABLE_NAME: 'user_group',
    USER_TASK_TABLE_NAME: "user_task",
    USER_FAVOURITE_TASK_TABLE_NAME: "user__favourite_task",
    USER_FAVOURITE_GROUP_TABLE_NAME: "user__favourite_group",
    TASK_GROUP_TABLE_NAME: 'user_group',
    INVITE_LINK_GROUP_TABLE_NAME: 'invite_link_group',
    INVITE_LINK_TASK_TABLE_NAME: 'invite_link_task'
}

export const JWT_SECRET = process.env.JWT_SECRET!

export const Transporter = {
    HOST: "smtp.mail.ru",
    PORT: 465,
    ISSECURE: true,
    USER: "bajenov-sasha2002@mail.ru",
    PASS: "4CjuLKictpBCDtegPD9h" //"Pokoets9-6fronder-6furor"
}