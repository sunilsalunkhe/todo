import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 12,
    userSchema = new Schema(
        {
            "email_id": {
                "type": String,
                "required": true
            },
            "password": {
                "type": String,
                "required": true
            },
            "is_verified": {
                "type": Boolean,
                "default": true,
                "required": true
            }
        },
        { "timestamps": { "createdAt": "created_at", "updatedAt": "updated_at" } }
    );

// set function to encrypt password on save
userSchema.pre("save", function (next) {

    // eslint-disable-next-line consistent-this
    const user = this;

    // eslint-disable-next-line camelcase
    // only hash the password if it has been modified (or is new)
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            next(err);
        }
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) {
                next(hashError);
            }
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

export default mongoose.model("User", userSchema);
