import { success, error } from "../../utils/responseformatter.js";
import validationSchema from "../../validationSchema/index.js";
import UserService from "./userservice.js";
import routes from "../../utils/routes.js";

const userJoiSchema = new validationSchema.UserJoiSchema(),
    userService = new UserService(),

    saveUser = async function (request, h) {
        const payload = request.payload,
            lang = request.i18n.__;
        try {
            const response = await userService.saveUser(payload, lang);
            return success(response, h);
        } catch (err) {
            return error(err, h);
        }
    };

export default {
    "version": "1.0.0",
    "name": "usercontroller",
    // eslint-disable-next-line max-lines-per-function
    "register": async function (server) {
        server.route([
            {
                "method": "POST",
                "path": routes.user.user,
                "handler": saveUser,
                "options": {
                    "description": "create user api",
                    "notes": "Return saved user.",
                    "tags": ["api"],
                    "auth": false,
                    "validate": {
                        "payload": userJoiSchema.saveData(),
                        "options": {
                            "allowUnknown": true
                        }
                    }
                }
            }
        ]);
    }
};
