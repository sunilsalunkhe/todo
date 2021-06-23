import { buildSucess } from "../../utils/responseformatter.js";
import TodoDao from "../../modelDao/todoDao.js";

const todoDao = new TodoDao();

class TodoService {
    async saveTodo(payload, userId, lang) {
        payload.user_id = userId;
        let todo = await todoDao.saveTodo(payload);
        return buildSucess(todo, lang("TODO_SAVE_SUCCESS"));
    }
    async getTodo(payload, userId, lang) {
        let todo = await todoDao.getTodo(userId);
        return buildSucess(todo, lang("TODO_LIST_SUCCESS"));
    }
    async deleteTodo( payload, userId, lang ) {
        await todoDao.deleteTodo( payload );
        return buildSucess( {}, lang( "TODO_DELETE_SUCCESS" ) );
    }
}

export default TodoService;
