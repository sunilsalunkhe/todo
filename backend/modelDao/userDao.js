import db from "../models/index.js";
import parseError from "../utils/mongoParser.js";
import constant from "../utils/constant.js";

class UserDao {
    async saveUser(payload) {
        const user = new db.User(payload);

        try {
            return await user.save();
        } catch (err) {
            throw parseError(err);
        }
    }
    async getUserByEmailID(options) {
        try {
            return await db.User.findOne(options)
                .select(constant.USER_INFO_PRIVATE);
        } catch (err) {
            throw parseError(err);
        }
    }
    async getUserById( id ) {
        try{
            return await db.User.findOne( {
                "_id": id
            } )
                .select( constant.USER_INFO_PRIVATE );
        } catch( err ) {
            throw parseError( err );
        }
    }
}

export default UserDao;
