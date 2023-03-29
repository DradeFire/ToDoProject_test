import User from "../../../database/model/final/User.model"
import { ErrorResponse } from "../../../middleware/custom-error";
import { StatusCode } from "../../../utils/constants";

export async function getAndCheckAuthCandidate(email: string): Promise<User> {
    const candidate = await User.findOne({
        where: {
            email: email
        }
    });
    if (!candidate) {
        throw new ErrorResponse("INCORRECT_LOGIN", StatusCode.BAD_REQUEST_400);
    }

    return candidate
}

export async function checkExistCandidate(email: string) {
    const candidate = await User.findOne({
        where: {
            email: email
        }
    });

    if (candidate) {
        throw new ErrorResponse("USER_EMAIL_EXIST", StatusCode.BAD_REQUEST_400);
    }
}
