import db from "../models/index.js";
import parseError from "../utils/mongoParser.js";

class TodoDao {
    async saveTodo(payload) {
        const todo = new db.Todo(payload);
        try {
            return await todo.save();
        } catch (err) {
            throw parseError(err);
        }
    }
    async getTodo(userId) {
        try {
            return await db.Todo.find({ "user_id": userId }).sort( { "created_at": -1 } );
        } catch (err) {
            throw parseError(err);
        }
    }
    async deleteTodo( payload ) {
        try{
            return await db.Todo.deleteOne( { "_id": payload._id } );
        } catch( err ) {
            throw parseError( err );
        }
    }
}

export default TodoDao;
