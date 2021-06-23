import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import constant from "../../utils/constant.js";
import { buildSucess } from "../../utils/responseformatter.js";
import Boom from "@hapi/boom";
import UserDao from "../../modelDao/userDao.js";
import configEnv from "../../config/config.js";

const userDao = new UserDao(),
    env = process.env.NODE_ENV || "local",
    config = configEnv[env],
    privateKey = config.private_key;
// twilio = new Twilio();


class AuthService {

    async basicAuth(request, username, password) {
        if (!(username === config.oauth2.clientId && password === config.oauth2.secret)) {
            return { "credentials": null, "isValid": false };
        }
        const isValid = true,
            credentials = { "clientId": username };

        return { isValid, credentials };
    }

    async validate(request, token, h) {
        let isValid = false,
            credentials = {},
            artifacts = {
            };

        try {
            // this code inserted for ignoring lint issue
            if (h === "" && request === "") {
                // eslint-disable-next-line no-console
                console.log("do nothing");
            }


            const decode = jwt.verify(token, privateKey);

            if (decode) {
                const user = await userDao.getUserById(decode.userId);

                if (user) {
                    isValid = true;
                    credentials = {
                        "token": token,
                        "userId": user._id
                    };
                    artifacts = {
                    };

                    return { isValid, credentials, artifacts };
                }

                return { isValid, credentials, artifacts };


            }
        } catch (err) {
            return { isValid, credentials, artifacts };
        }
    }

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }


    getEncryptedPassword(newPassword) {
        const salt = bcrypt.genSaltSync(12);

        return bcrypt.hashSync(newPassword, salt);

    }

    createAuthToken(userId, clientId, tokenType) {
        return new Promise((resolve, reject) => {
            let expire;

            if (tokenType === "refresh_token") {
                expire = constant.REFRESH_EXPIRY;
            }
            if (tokenType === "auth_token") {
                expire = constant.AUTH_EXPIRY;
            }
            const authToken = jwt.sign({
                "userId": userId,
                "clientId": clientId,
                "tokenType": tokenType
            }, privateKey, { "expiresIn": expire });

            if (authToken === null || authToken === undefined) {
                reject("Error in token creation");
            } else {
                resolve(authToken);
            }
        });
    }

    async checkPassword(payload, lang) {
        let user,
            refreshToken = "", authToken = "", options = "";
        const self = this;

        options = { "email_id": { "$regex": new RegExp(`^${payload.email_id}$`, "i") } };

        if (payload.email_id && payload.password) {
            user = await userDao.getUserByEmailID(options);
            if (!user) {
                throw new Error(lang("NO_SUCH_USER_FOUND"));
            }
            const check = self.comparePassword(payload.password, user.password);

            if (!check) {
                throw new Error(lang("PASSWORD_NOT_MATCH"));
            }
            // create token
            refreshToken = await self.createAuthToken(user._id, config.oauth2.clientId, "refresh_token");
            authToken = await self.createAuthToken(user._id, config.oauth2.clientId, "auth_token");
            user.password = "";

            return {
                "user": user,
                "refresh_token": refreshToken,
                "auth_token": authToken
            };
        }
        throw new Error(lang("INVALID_PAYLOAD"));

    }

    async refreshToken(payload, lang) {
        let user, decode;
        const self = this;

        if (payload.refresh_token) {
            try {
                decode = jwt.verify(payload.refresh_token, privateKey);
            } catch (error) {
                throw Boom.unauthorized("invalid password");
            }
            user = await userDao.getUserById(decode.userId);
            if (!user) {
                throw new Error(lang("NO_SUCH_USER_FOUND"));
            }
            // create token
            const authToken = await self.createAuthToken(user._id, user.role, config.oauth2.clientId, "auth_token");

            return {
                "auth_token": authToken
            };
        }
        throw new Error(lang("INVALID_PAYLOAD"));

    }

    async authenticateUser(payload, lang) {
        let data;

        if (payload.grant_type === "password") {
            data = await this.checkPassword(payload, lang);
        } else if (payload.grant_type === "refresh_token") {
            data = await this.refreshToken(payload, lang);
        } else {
            throw new Error(lang("INVALID_PAYLOAD"));
        }
        return buildSucess(data, lang("LOGIN_SUCCESS"));
    }

}

export default AuthService;
