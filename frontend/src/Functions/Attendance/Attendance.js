import React, { useEffect, useState  } from 'react';
import Button from '@material-ui/core/Button';
import  './../../styles/App.css';
import axios from 'axios';
import { getUser } from './../../Utils/Common';

function Attendance() {
  var today = new Date();
  const user = getUser();
  const [isDisable, setisDisable] = useState('disabled');
  const [MarkedTime, setMarkedTime] = useState('');

  function getAttendance(){
    axios.get('http://localhost:4000/attendance/'+ user._id)
      .then(response => {
       // console.log(JSON.stringify(response.data));
        const myRepo = response.data;
        
        if (myRepo.length === 0){
          setisDisable('');
        }else{
          var count = (myRepo.length-1)
          var startDate = new Date(myRepo[(count)].year, myRepo[(count)].mo, myRepo[(count)].date, myRepo[(count)].hrs,myRepo[(count)].min, 0);
          var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0);
          var diff = endDate.getTime() - startDate.getTime();
          var hours = Math.floor(diff / 1000 / 60 / 60);
          diff -= hours * 1000 * 60 * 60;

          var final_diff = parseInt((hours < 9 ? "0" : "") + hours,10);
          console.log(final_diff);

          if (final_diff <= 8){
            setisDisable('disabled');
            setMarkedTime(myRepo[(count)].hrs + ':' + myRepo[(count)].min);
          }else{
            setisDisable('');
          }
        }
      });

      
  }


 async function onSubmit(event) {
    event.preventDefault();
    setisDisable('disabled');

    const attOBJ = {
      eid: user._id,
      hrs:  today.getHours(),
      min: today.getMinutes(),
      year:today.getFullYear(),
      mo: today.getMonth(),
      date: today.getDate(),
      name: user.name
    };
    await axios.post('http://localhost:4000/attendance/create', attOBJ) //add to database
      .then(res => console.log(res.data));  //log to terminal

    

  }


  useEffect(() => {getAttendance()},[]);

    return (
      <div>
        <div className="prof">
          <h2>Mark Attendance</h2>
          <form onSubmit={onSubmit}>
          <Button variant="contained" color="primary"  type="submit"  disabled={isDisable}>
            Mark Attendance
          </Button></form><br></br><br></br>
          <Button variant="contained" disabled>
            Marked Time: {MarkedTime}
          </Button><br></br><br></br>
        </div>
      </div>
    )
  }
  
  export default Attendance