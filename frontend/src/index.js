import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId='402610139706-06g772qgq0us77e3bjj4213oilssfasu.apps.googleusercontent.com'>
  <BrowserRouter>
    <App /> 
    </BrowserRouter>
    </GoogleOAuthProvider>
);

// ReactDOM.render((
//   <GoogleOAuthProvider clientId='402610139706-06g772qgq0us77e3bjj4213oilssfasu.apps.googleusercontent.com'>
//   <BrowserRouter>
//     <App /> 
//     </BrowserRouter>
//     </GoogleOAuthProvider>
//   ), document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
