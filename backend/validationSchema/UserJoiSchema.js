import Joi from "joi";
import joiObj from "joi-objectid";
Joi.objectId = joiObj(Joi);
import constant from "../utils/constant.js";

class UserJoiSchema {
    getJoi(data) {
        return Joi.object().keys(data);
    }

    saveData() {
        const data = {
            "email_id": Joi.string().email({ "tlds": { "allow": false } }).required().max(255),
            "password": Joi.string().required()
        };
        return this.getJoi(data);
    }

    authLogin() {
        const data = {
            "email_id": Joi.string().optional(),
            "password": Joi.string().optional(),
            "refresh_token": Joi.string().optional(),
            "grant_type": Joi.string().valid("password", "refresh_token").required()
        };
        return this.getJoi(data);
    }
}

export default UserJoiSchema;
