import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import * as storageHelper from "./utils/local-storage-helper";

function App() {
  let UserData = storageHelper.getObj("USER_DATA");
  let isUserLoggedIn = UserData?.auth_token && UserData?.refresh_token ? 'home' : 'login';
  const [ isLogin, setIsLogin ] = useState(isUserLoggedIn);
  const changeThePage = (redirectTo) => {
    setIsLogin(redirectTo);
  }
  return (
    <>
      {isLogin === 'login' ? <Login changeThePage={changeThePage} /> : <></>}
      {isLogin === 'register' ? <Register changeThePage={changeThePage} /> : <></>}
      {isLogin === 'home' ? <Home changeThePage={changeThePage} /> : <></>}
    </>
  );
}

export default App;
