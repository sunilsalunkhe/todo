import mongoose from "mongoose";
const Schema = mongoose.Schema,
todoSchema = new Schema(
    {
        "todo": {
            "type": String,
            "required": true
        },
        "user_id": {
            "type": Schema.Types.ObjectId,
            "ref": "User",
            "required": true
        }
    }, { "timestamps": { "createdAt": "created_at", "updatedAt": "updated_at" } }
);

export default mongoose.model("Todo", todoSchema);
