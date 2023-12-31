const bcrypt = require("bcryptjs");
const ProjectManager = require("../models/ProjectManager.model");
const jwt = require("jsonwebtoken");
const config = require("config");
const moment = require("moment");
const axios = require("axios");

//get All ProjectManager List
const getAllProjectManagerList = async (req, res) => {
  try {
    //get user details
    //-password : dont return the pasword
    const projectManagers = await ProjectManager.find().select("-password");
    res.json(projectManagers);
  } catch {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//get ProjectManager details
const getProjectManagerDetails = async (req, res) => {
  try {
    //get user details
    //-password : dont return the pasword
    const user = await ProjectManager.findById(req.user.id)
      .select("-password")
      .populate("projectsList", "_id projectName descripton")
      .populate({ path: "attendanceList", model: "Attendence" });
    res.json(user);
  } catch {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//Authenticate ProjectManager and get token
const loginProjectManager = async (req, res) => {
  const { email, password } = req.body;

  try {
    //See if user Exist
    let user = await ProjectManager.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    //match the user email and password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    //Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Authenticate ProjectManager With Face Authetication and get token
const loginProjectManagerWithFaceAuthetication = async (req, res) => {
  const { persistedFaceId } = req.body;

  try {
    //See if user Exist
    let user = await ProjectManager.findOne({ persistedFaceId });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    //Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Register ProjectManager
const registerProjectManager = async (req, res) => {
  const { name, username, email, password, mobileNumber, rate } = req.body;

  try {
    //See if user Exist
    let user = await ProjectManager.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "ProjectManager already exist" }] });
    }

    const profileImg =
      "https://firebasestorage.googleapis.com/v0/b/econnecteee.appspot.com/o/profileImg.jpg?alt=media&token=46df70d2-9365-4a45-af63-b21c44585f9c";
    const salary = 0.0;
    //create a user instance
    user = new ProjectManager({
      name,
      username,
      email,
      password,
      mobileNumber,
      rate,
      profileImg,
      salary,
    });

    //Encrypt Password

    //10 is enogh..if you want more secured.user a value more than 10
    const salt = await bcrypt.genSalt(10);

    //hashing password
    user.password = await bcrypt.hash(password, salt);

    //save user to the database
    await user.save();

    //Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Update ProjectManager ProfileDetails
const updateProjectManagerProfile = async (req, res) => {
  try {
    const user = await ProjectManager.findById(req.params.id);

    if (user != null) {
      ProjectManager.findByIdAndUpdate(req.params.id).then(
        async (userProfile) => {
          userProfile.name = req.body.name;
          userProfile.profileImg = req.body.profileImg;
          if (req.body.persistedFaceId) {
            userProfile.persistedFaceId = req.body.persistedFaceId;
          }
          userProfile.username = req.body.username;
          userProfile.mobileNumber = req.body.mobileNumber;
          userProfile.address = req.body.address;
          if (req.body.password) {
            //Encrypt Password
            //10 is enogh..if you want more secured.user a value more than 10
            const salt = await bcrypt.genSalt(10);
            //hashing password
            userProfile.password = await bcrypt.hash(req.body.password, salt);
          }

          userProfile
            .save()
            .then(() => res.json("User Profile Updated!"))
            .catch((err) => res.status(400).json("Error: " + err));
        }
      );
    }
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Delete Project Manager
const deleteProjectManager = async (req, res) => {
  try {
    const user = await ProjectManager.findById(req.params.id);

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "cc8d3f8f4b23401c9e3b36474ecce84d",
      },
    };

    if (user.persistedFaceId) {
      await axios
        .delete(
          `https://eastus.api.cognitive.microsoft.com/face/v1.0/largefacelists/productmanagerlist/persistedfaces/${user.persistedFaceId}`,
          config
        )
        .then(async() => {
          await ProjectManager.findByIdAndDelete(req.params.id)
            .then(() => {
              res.json("Project Manager Deleted");
            })
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await ProjectManager.findByIdAndDelete(req.params.id)
        .then(() => {
          res.json("Project Manager Deleted");
        })
        .catch((err) => res.status(400).json("Error: " + err));
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

//Confirm PM Face Authentication
const confirmPMFaceAuthentication = async (req, res) => {
  try {
    const emp = await ProjectManager.findOne({
      persistedFaceId: req.params.persistedFaceId,
    }).select("_id name username persistedFaceId");
    res.json(emp);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

//Confirm In Time - Attendence
const confirmInTime = async (req, res) => {
  try {
    const user = await ProjectManager.findById(req.params.userid);
    if (user != null) {
      ProjectManager.findByIdAndUpdate(req.params.userid).then(async () => {
        const { inTime, date } = req.body;
        try {
          const newAttendenceObj = new Attendence({
            inTime,
            date,
          });

          //save Issue to the database
          await newAttendenceObj
            .save()
            .then(async (createdAttendenceObj) => {
              user.attendanceList.unshift(createdAttendenceObj);
              await calculatePMSalary(req.params.userid);
              await user.save();
              res.json(user);
            })
            .catch((err) => res.status(400).json("Error: " + err));
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      });
    }
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

//Confirm Out Time - Attendence
const confirmOutTime = async (req, res) => {
  try {
    Attendence.findByIdAndUpdate(req.params.attendenceId).then(
      async (attendence) => {
        console.log("click");
        try {
          attendence.outTime = req.body.outTime;
          await attendence
            .save()
            .then(async (createdAttendenceObj) => {
              res.json(createdAttendenceObj);
            })
            .catch((err) => res.status(400).json("Error: " + err));
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
      }
    );
  } catch (err) {
    //Something wrong with the server
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

calculatePMSalary = async (userID) => {
  try {
    let date_ob = new Date();
    // current month
    let month = date_ob.getMonth() + 1;
    // current year
    let year = date_ob.getFullYear();

    const user = await ProjectManager.findById(userID).populate({
      path: "attendanceList",
      model: "Attendence",
    });
    let days = 0;

    user.attendanceList.forEach((attendance) => {
      let mon = moment().month(attendance.date.slice(5, 8)).format("M");
      let yer = attendance.date.slice(12, 16);
      console.log(attendance);

      if (month == mon && yer == year) {
        ++days;
      }
    });
    ProjectManager.findByIdAndUpdate(userID).then(async (userProfile) => {
      userProfile.salary = user.rate * (days + 1);
      userProfile.save().then((res) => {});
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  confirmPMFaceAuthentication,
  confirmInTime,
  confirmOutTime,
  getProjectManagerDetails,
  loginProjectManager,
  registerProjectManager,
  updateProjectManagerProfile,
  getAllProjectManagerList,
  deleteProjectManager,
  loginProjectManagerWithFaceAuthetication,
};