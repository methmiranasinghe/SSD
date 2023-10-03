let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
const helmet = require("helmet");


const userRoute = require('../backend/routes/user.route')
const taskRoute = require('../backend/routes/task.route')
const AnnouncementRoute = require('../backend/routes/announcement.route')
const salaryRoute = require('../backend/routes/salary.route')
const SubmissionRoute = require('../backend/routes/submission.route')
const RateRoute = require('../backend/routes/rate.route')
const AttendanceRoute = require('../backend/routes/attendance.route')
const ChatRoute = require('../backend/routes/chat.route')
const AssetRoute = require('../backend/routes/asset.route')

// Express Route

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
}).then(() => {
  console.log('Database sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-scripts.com"],
      },
    },
    referrerPolicy: { policy: "same-origin" },
    expectCt: { enforce: true, maxAge: 30 },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
  })
);

const corsOptions ={
  origin:'https://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use('/users', userRoute)
app.use('/tasks', taskRoute)
app.use('/Announcement', AnnouncementRoute)
app.use('/salary', salaryRoute)
app.use('/Submission', SubmissionRoute)
app.use('/Rate', RateRoute)
app.use('/attendance', AttendanceRoute)
app.use('/chat', ChatRoute)
app.use('/asset', AssetRoute)

// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});