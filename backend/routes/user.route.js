const jwt = require('jsonwebtoken');
const util = require('./util');
require('dotenv').config();
const CryptoJS = require("crypto-js");
const key = "ASECRET";
const axios = require('axios');
const sanitizeHtml = require('sanitize-html');


const userData = {
  email: "123456",
  username: "tooti"
};
let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// user Model
let userSchema = require('../Models/User');
const sanitize = require('sanitize-html');

// CREATE user
router.route('/create-user').post((req, res, next) => {
    userSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});


router.route("/login-user").post((req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
console.log(username, 'before')
  // Sanitize the username
  sanitizeUsername = sanitizeHtml(username, {
    allowedTags: [],  // No HTML tags allowed
    allowedAttributes: {}, // No HTML attributes allowed
  });
  console.log(sanitizeUsername, 'after')
  const user = userSchema.findOne({ username: sanitizeUsername }, (error, data) => {
    console.log(user);
    if (data) {
      if (
        CryptoJS.AES.decrypt(data.password, key).toString(CryptoJS.enc.Utf8) ===
        password
      ) {
        const token = util.generateToken(data);
        const userObj = util.getCleanUser(data);
        return res.json({ user: userObj, token });
      } else {
        return res.json({ user: "pw Error" });
      }
    } else if (error) {
      return res.json({ user: "Error" });
    } else {
      return res.json({ user: "User Error" });
    }
  });
});

router.route("/oauth-login").post(async (req, res) =>
{
  const googleUserUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=";
  const { clientId } = req.body;

  if(!clientId) return res.json({ user: 'Client ID required' });
  try {
    const response = await axios.get(googleUserUrl + clientId);
    console.log("user data top ",response.data)
    if (response.data)
    {
      console.log("user info ", response.data);
      const userEmail = response.data.email;

      const data = await userSchema.findOne({ username: userEmail });
      if (data)
      {
        const token = util.generateToken(data);
        const userObj = util.getCleanUser(data);
        console.log("User account already available ",data)
        return res.json({ user: userObj, token });
      } else
      {
        console.log("User account not available... creating new account ")
        const r = response.data;
        const newUserObj = {
          email: r.email,
          name: r?.name,
          username: r.email,
          salary: "0",
          roll: "Employee",
          department: "IT",
        }
        userSchema.create(newUserObj, (error, data) =>
        {
          if (error)
          {
            return next(error)
          } else
          {
            const token = util.generateToken(data);
            // const userObj = util.getCleanUser(data);
            return res.json({ user: data, token });
          }
        })
      }

    } else
    {
      return res.json({ user: 'Error oauth' });
    }
    // return res.json({ user: response.data?.email });
  } catch (error)
  {
    console.log("error ",error)
    return res.json({ user: 'Error oauth' });
  }
})

// READ Students
router.route('/').get((req, res) => {
    userSchema .find((error, data) => {
      if (error) {
        return next(error)
      } else {
        let filtered_data = data.map(({_id, name, username, email, salary,department, roll}) => ({_id, name, username, email, salary,department, roll}));
        res.json(filtered_data)
      }
    })
  })

  router.route('/get-user/:id').get((req, res) => {
    userSchema.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })

// READ Students
router.route('/employees').get((req, res) => {
  userSchema .find({roll:"Employee"},(error, data) => {
    if (error) {
      return next(error)
    } else {
      let emp_data = data.map(({username,name, _id}) => ({username,name, _id}));
      res.json(emp_data)
    }
  })
})


// Get Single Student
router.route('/verifyToken').get((req, res) => {
    let token = req.body.token || req.query.token;
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token is required."
      });
    }
    // check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) return res.status(401).json({
        error: true,
        message: "Invalid token."
      });

      // get basic user details
      let userObj = util.getCleanUser(user);
      return res.json({ user: userObj, token });
    });
})

// Update User
router.route('/update-user/:id').put((req, res, next) => {
  userSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error)
      return next(error);
      
    } else {
      res.json(data)
      console.log('Task updated successfully !')
    }
  })
})

// Delete User
router.route('/delete-user/:id').delete((req, res, next) => {
  userSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})


module.exports = router;