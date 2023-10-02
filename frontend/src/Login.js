import  './styles/App.css';
import Header from './Header';
import Footer from './Footer';
import React, {useState} from "react";
import axios from 'axios';
import { setUserSession } from './Utils/Common';
import { GoogleLogin } from '@react-oauth/google';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userObj = {
      username: username,
      password: password,
    };

    
    const loginUrl = "http://localhost:4000/users/login-user"

    axios.post(loginUrl, userObj)
      .then((res) => {
        console.log(res.data.user); // log to terminal
        if (res.data.user === 'pw Error') {
          alert("Please Check Password!");
        } else if (res.data.user === 'User Error') {
          alert("Please Check Username!");
        } else if (res.data.user === 'Error') {
          alert("Error!");
        } else {
          setUserSession(res.data.token, res.data.user);
          window.location.href = "/EmpDashBoard";
        }
      });

    setUsername('');
    setPassword('');
  };

  const handleGoogleAuth = async (creds) =>
  {
    try
    {
      console.log("client id ",creds)
      const loginUrl = "http://localhost:4000/users/oauth-login"
      const response = await axios.post(loginUrl, {
        clientId: creds.credential
      });
      const userData = response.data;
      if (userData)
      {
        console.log("User logged in ", userData);
        setUserSession(userData.token, userData.user);
        window.location.href = "/EmpDashBoard";
      } else
      {
        console.log("no data")
      }
    } catch (error) {
      console.log("oauth error ", error);
    }
  }

  return (
    <div>
      <Header />

      <div className="center">
        <form onSubmit={onSubmit}>
          <p>Username:</p>
          <input
            type="text"
            id="uname"
            name="uname"
            value={username}
            onChange={onChangeUsername}
            required
          /><br></br>
          <p>Password:</p>
          <input
            type="password"
            id="pwd"
            name="pwd"
            value={password}
            onChange={onChangePassword}
            required
          /><br></br><br></br>
          <br></br>
          <input id="Signin" type="submit" value="Submit" />
         
          
          <div style={{
            width: "95%",
          marginTop:"5px"}}><GoogleLogin 
            onSuccess={handleGoogleAuth}
  onError={() => {
    console.log('Login Failed');
  }}
/></div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Login;