import React from 'react'
import './styles/App.css';
import  './header.css';
import logo from './images/Blue logo-cropped.png';

function Header() {

  return (
    <div>
      <nav>
            <ul>
            <li><a href="/">Home</a></li>
            
            <li><a href="/Feedback">Feedback</a></li>
            </ul>
            <ul>
          <li><a href="/CustomerInquiry">Customer Inquiry</a></li>
          <li><a href="/ExceptionDemo">Users</a></li>
          <li><a href="/ExceptionDemoFix">Users(Secure)</a></li>
            </ul>
        </nav>
        <img src={logo} id="logo" alt="Logo"></img>
    </div>


    
  )
}


function NavigationBar() {
  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><a href="/">Home</a></li>
        <li className="navbar-item"><a href="/Feedback">Feedback</a></li>
        <li className="navbar-item"><a href="/CustomerInquiry">Customer Inquiry</a></li>
        <li className="navbar-item"><a href="/ExceptionDemo">Users</a></li>
        <li className="navbar-item"><a href="/ExceptionDemoFix">Users(Secure)</a></li>
      </ul>
    </div>
  );
}

export default NavigationBar;


// export default Header