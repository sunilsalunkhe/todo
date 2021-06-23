import { Form, Input, Button } from 'antd';
import './App.css';
import Api from "./services/Api";
import * as storageHelper from "./utils/local-storage-helper";

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const onFinish = (values, props) => {
    const api = new Api();
    api
      .login(values.email, values.password)
      .then((resp) => {
        if( resp.data.status === 'success' && resp.data.statusCode === 200){
          storageHelper.setObj("USER_DATA", resp.data.data);
          props.changeThePage('home');
        }
      })
      .catch((error) => {
        if (error && error.data && error.data.message) {
            console.log("error....", error);
        }
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const changeThePage = (props) => {
    props.changeThePage('register');
  }

function Login(props) {
  return (
    <div className="login-cont">
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={(values) => onFinish(values, props)}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
              Log in
          </Button>
          Or <Button type="link" onClick={() => changeThePage(props)} className="link-effect">register now!</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
