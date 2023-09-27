// src/SuccessAlert.js
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

function SuccessAlert() {
  const history = useHistory();

  useEffect(() => {
    // Redirect to the home page after 5 seconds
    const redirectTimer = setTimeout(() => {
      history.push("/");
    }, 5000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [history]);

  return (
    <div>
      <h1>Submitted Inquiry Successfully. We will Contact you soon</h1>
    </div>
  );
}

export default SuccessAlert;
