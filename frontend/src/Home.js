import React, { useState, useEffect } from 'react';
import { List, Button, Modal, Input } from 'antd';
import './App.css';
import Api from "./services/Api";
import * as storageHelper from "./utils/local-storage-helper";

const deleteTodo = (item, cb) => {
    const api = new Api();
    api
      .delete_todo(item._id)  
      .then((resp) => {
        if( resp.data.status === 'success' && resp.data.statusCode === 200){
            getTodoList((todoList) => {
                cb(todoList);
            });
        }
      })
      .catch((error) => {
        if (error && error.data && error.data.message) {
            console.log("error....", error);
        }
      });
}

const addNewTodo = (newTodo, cb) => {
    const api = new Api();
    api
      .add_todo(newTodo)  
      .then((resp) => {
        if( resp.data.status === 'success' && resp.data.statusCode === 200){
            getTodoList((todoList) => {
                cb(todoList);
            });
        }
      })
      .catch((error) => {
        if (error && error.data && error.data.message) {
            console.log("error....", error);
        }
      });
}

const getTodoList = (cb) => {
    const api = new Api();
    api
      .get_goto_list()  
      .then((resp) => {
        if( resp.data.status === 'success' && resp.data.statusCode === 200){
          cb(resp.data.data);
        }
      })
      .catch((error) => {
        if (error && error.data && error.data.message) {
            console.log("error....", error);
        }
      });
}

const logout = (props) => {
    storageHelper.clearAllLocalStorage();
    props.changeThePage('login');
}

function Home(props) {
    const [ todoList, setTodos ] = useState([]);
    const [ newTodo, setNewTodo ] = useState('');
    const [ userDetails, setUser ] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        setUser(storageHelper.getObj("USER_DATA"))
        getTodoList((todoList) => {
            setTodos(todoList);
        });
    }, []);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
        addNewTodo(newTodo, (todoList) => {
            setTodos(todoList);
            setNewTodo('');
        });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const deleteTodoItem = (item) => {
        deleteTodo(item, (todoList) => {
            setTodos(todoList);
        });
    };
    return (
        <div className="home-cont">
            <div className="header-cont clearfix">
                Hello {userDetails?.user?.email_id}, welcome back!
                <Button onClick={() => logout(props)}>Logout</Button>
            </div>
            <List
                size="large"
                header={<div className="todo-list-header clearfix">TODO <Button onClick={showModal}>Add Todo</Button></div>}
                bordered
                dataSource={todoList}
                renderItem={(item) => <List.Item
                    actions={[<Button type="link" onClick={() => deleteTodoItem(item)} key="list-loadmore-more">delete</Button>]}
                >
                    {item.todo}
                </List.Item>}
            />
            <Modal title="Basic Modal" visible={isModalVisible} okText={'Add'} onOk={handleOk} onCancel={handleCancel}>
                <Input value={newTodo} onChange={(value) => setNewTodo(value.target.value)} placeholder="Add new todo" />
            </Modal>
        </div>
    );
}

export default Home;
