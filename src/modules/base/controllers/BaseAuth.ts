import User from "../../../database/model/final/User.model"
import { ErrorResponse } from "../../../middleware/custom-error";
import { ErrorReasons, StatusCode } from "../../../utils/constants";

export default class BaseAuth {

    protected async getAndCheckAuthCandidate(email: string): Promise<User> {
        const candidate = await User.findOne({
            where: {
                email: email
            }
        });
        if (!candidate) {
            throw new ErrorResponse(ErrorReasons.INCORRECT_LOGIN_400, StatusCode.BAD_REQUEST_400);
        }

        return candidate
    }

    protected async checkExistCandidate(email: string): Promise<void> {
        const candidate = await User.findOne({
            where: {
                email: email
            }
        });

        if (candidate) {
            throw new ErrorResponse(ErrorReasons.USER_EMAIL_EXIST_400, StatusCode.BAD_REQUEST_400);
        }
    }
}

