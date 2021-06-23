import { success, error } from "../../utils/responseformatter.js";
import validationSchema from "../../validationSchema/index.js";
import TodoService from "./todoservice.js";
import routes from "../../utils/routes.js";

const todoJoiSchema = new validationSchema.TodoJoiSchema(),
    todoService = new TodoService(),

    saveTodo = async function (request, h) {
        const payload = request.payload,
            lang = request.i18n.__,
            userId = request.auth.credentials.userId;
        try {
            const response = await todoService.saveTodo(payload, userId, lang);
            return success(response, h);
        } catch (err) {
            return error(err, h);
        }
    },
    getTodo = async function (request, h) {
        const query = request.query,
            lang = request.i18n.__,
            userId = request.auth.credentials.userId;
        try {
            const response = await todoService.getTodo(query, userId, lang);
            return success(response, h);
        } catch (err) {
            return error(err, h);
        }
    },
    deleteTodo = async function (request, h) {
        const payload = request.payload,
            lang = request.i18n.__,
            userId = request.auth.credentials.userId;
        try {
            const response = await todoService.deleteTodo(payload, userId, lang);
            return success(response, h);
        } catch (err) {
            return error(err, h);
        }
    };

export default {
    "version": "1.0.0",
    "name": "todocontroller",
    // eslint-disable-next-line max-lines-per-function
    "register": async function (server) {
        server.route([
            {
                "method": "POST",
                "path": routes.todo.todo,
                "handler": saveTodo,
                "options": {
                    "description": "create todo api",
                    "notes": "Return saved todo.",
                    "tags": ["api"],
                    "auth": "token",
                    "validate": {
                        "payload": todoJoiSchema.saveData(),
                        "options": {
                            "allowUnknown": true
                        }
                    },
                    "plugins": {
                        "hapi-rate-limit": {
                            "enabled": true
                        }
                    }
                }
            },
            {
                "method": "GET",
                "path": routes.todo.get_todo,
                "handler": getTodo,
                "options": {
                    "description": "Get todo list",
                    "notes": "Return todo list.",
                    "tags": ["api"],
                    "auth": "token",
                    "validate": {
                        "query": todoJoiSchema.getTodoList(),
                        "options": {
                            "allowUnknown": true
                        }
                    }
                }
            },
            {
                "method": "POST",
                "path": routes.todo.delete_todo,
                "handler": deleteTodo,
                "options": {
                    "description": "Delete todo API",
                    "notes": "Delete todo.",
                    "tags": ["api"],
                    "auth": "token",
                    "validate": {
                        "payload": todoJoiSchema.deleteTodo(),
                        "options": {
                            "allowUnknown": true
                        }
                    },
                    "plugins": {
                        "hapi-rate-limit": {
                            "enabled": true
                        }
                    }
                }
            }
        ]);
    }
};
