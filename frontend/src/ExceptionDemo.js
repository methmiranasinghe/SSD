import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4000/users/')
      .then((response) => {

        throw new Error(JSON.stringify(response.data));
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        // Poor exception handling - exposing sensitive information
          setError(err.message);
          console.log("Error", err.message)
      });
  }, []);

  return (
    <div>
      {error ? (
        <p>An error occurred: {error}</p>
      ) : (
        <div>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          {/* ... other user data */}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
