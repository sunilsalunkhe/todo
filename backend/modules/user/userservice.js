import { buildSucess } from "../../utils/responseformatter.js";
import UserDao from "../../modelDao/userDao.js";

const userDao = new UserDao();

class UserService {
    async saveUser(payload, lang) {
        let user,
            userPayload = {
                "password": payload.password,
                "email_id": payload.email_id
            };

        user = await userDao.saveUser(userPayload);
        return buildSucess(user, lang("USER_SAVE_SUCCESS"));
    }
}

export default UserService;
