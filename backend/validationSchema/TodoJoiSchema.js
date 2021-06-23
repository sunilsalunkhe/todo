import Joi from "joi";
import joiObj from "joi-objectid";
Joi.objectId = joiObj(Joi);

class TodoJoiSchema {
    getJoi(data) {
        return Joi.object().keys(data);
    }

    saveData() {
        const data = {
            "todo": Joi.string().required()
        };
        return this.getJoi(data);
    }

    getTodoList() {
        const data = {};
        return this.getJoi(data);
    }

    deleteTodo() {
        const data = {
            "_id": Joi.objectId().required()
        };
        return this.getJoi(data);
    }
}

export default TodoJoiSchema;
