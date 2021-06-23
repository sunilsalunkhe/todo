
import { success, error } from "../../utils/responseformatter.js";
import validationSchema from "../../validationSchema/index.js";
import AuthService from "./authservice.js";
import routes from "../../utils/routes.js";

const userJoiSchema = new validationSchema.UserJoiSchema(),
    authService = new AuthService(),
    authenticateUser = async function (request, h) {
        const lang = request.i18n.__,
            payload = request.payload;

        try {
            const response = await authService.authenticateUser(payload, lang);

            return success(response, h);
        } catch (err) {
            return error(err, h);
        }
    };


export default {
    "version": "1.0.0",
    "name": "authcontroller",
    "register": async function (server) {
        server.route([{
            "method": "POST",
            "path": routes.auth.oauth_token,
            "handler": authenticateUser,
            "options": {
                "description": "authenticate email password.",
                "notes": "Return user.",
                "tags": ["api"],
                "auth": "simple",
                "validate": {
                    "payload": userJoiSchema.authLogin(),
                    "options": {
                        "allowUnknown": true
                    }
                }
            }
        }
        ]);
    }
};
