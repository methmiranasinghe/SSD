import "./Feedback.css";
import "./styles/App.css";
import React, { useState, useEffect } from "react";
//importing XSS Vulnerability fixing Library
//import DOMPurify from 'dompurify';

import { useHistory } from "react-router-dom";
function FeedBack() {
  const history = useHistory();
  const [feedback, setFeedback] = useState("");

//   const handleFeedbackSubmit = () => {
//     window.location.href = "/Success";
//   };

//XSS Vulnerability methods
//1. XSS alert popup 
//   const data =`<h1> Welcome to Feedback of ABC</h1>
//    <img src=?? onerror="alert('XSS Attack')"/>`;

//2. XSS redirection    
const data = `<h1> Welcome to Feedback of ABC</h1>
   <img src=??? onerror="location.replace('https://www.google.com')"/>`;

//3. Website defacement 
// const data = `<h1> Welcome to Feedback of ABC</h1>
//    <img src=??? onerror="document.body.background='https://miro.medium.com/v2/resize:fit:640/1*k59fb9I0L99NxuYo46Ezpw.gif' "/>`;
  return (
    <div>
      <h2>Feedback Form</h2>
      {/* Before Fixed XSS*/}
      <div
        style={{ padding: "20px", fontSize: "17px", textAlign: "center" }}
        dangerouslySetInnerHTML={{ __html: data }}
      ></div>
      {/* After Fixed XSS */}
      {/* <div style={{padding:"20px", fontSize:"17px", textAlign:"center" }} 
        dangerouslySetInnerHTML={{__html :DOMPurify.sanitize(data)}}
        > </div>*/}
    </div>
  );
}
export default FeedBack;