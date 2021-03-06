const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var MySQLStore = require('express-mysql-session')(session);
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

app.set('port', port);
app.use(cors());

// parsers
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var options = {
  host: process.env.DB_HOST || '104.155.184.169',
  port: 3306,
  user: process.env.DB_USERNAME || 'app',
  password: process.env.DB_USERPASS || '#&sK@4w37tUgat',
  database: process.env.DB_NAME || 'db_bits_and_bytes'
};

var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'bits_and_bytes',
    secret: 'whoknowswhathtesecretshouldbeIsuredont',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000000,
        rolling: true
    }
}));

const APP_HOST_URL = process.env.APP_HOST_URL || 'https://fighting-mongooses-dev-256623.appspot.com http://localhost:8080';
// set headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', APP_HOST_URL);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' === req.method) {
      res.send(200);
  } else {
    next();
  }
});

// route to backend API
const users_routes = require('./backend/api/users');
app.use('/api/users/', users_routes);
const announcements_routes = require('./backend/api/announcements');
app.use('/api/announcements/', announcements_routes);
const session_routes = require('./backend/api/session');
app.use('/api/session/', session_routes);

const attendance_routes = require('./backend/api/attendancelogging');
app.use('/api/attendancelogging/', attendance_routes);


const file_routes = require('./backend/api/file');
app.use('/api/file/', file_routes);
const requiredFile_routes = require('./backend/api/required_file');
app.use('/api/required_file/', requiredFile_routes);
const surveys_routes = require('./backend/api/surveys');
app.use('/api/surveys/', surveys_routes);
const email_routes = require('./backend/api/email');
app.use('/api/email/', email_routes);

const registered_student_routes = require('./backend/api/registered_students');
app.use('/api/registered_students/', registered_student_routes);

// route to frontend static pages
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get('/StaticPages/:name', function(req, res) {
    let page = req.params.name;
    let type = "none";
    if(req.session.userType)
      type = req.session.userType;
    let allow = 1;
    //restrict access here
    if(decodeURIComponent(page).toUpperCase() === "ANNOUNCEMENTS.HTML" && type !== "Admin")
      allow = 0;
    if((decodeURIComponent(page).toUpperCase() === "SURVEYS.HTML" || decodeURIComponent(page).toUpperCase() === "SURVEY_QUESTIONS.HTML") && type !== "Admin")
      allow = 0;
    if(decodeURIComponent(page).toUpperCase() === "UPLOAD_PAGE.HTML" && type !== "Parent" && type !== "Admin")
      allow = 0;
    if(decodeURIComponent(page).toUpperCase() === "ADMIN_EMAIL.HTML" && type !== "Admin")
      allow = 0;
    if(decodeURIComponent(page).toUpperCase() === "ADMIN_FILES.HTML" && type !== "Admin")
    allow = 0;
    if(decodeURIComponent(page).toUpperCase() === "ATTENDANCE.HTML" && (type !== "Admin" && type !== "Parent" && type !== "Student"))
      allow = 0;
    if(decodeURIComponent(page).toUpperCase() === "REGISTRATION.HTML" && type !== "Parent")
      allow = 0;

    if(allow === 0)
      res.redirect('/');
    else
      res.sendFile(path.join(__dirname + '/frontend/StaticPages/' + page));
});

app.get('/Templates/:name', function(req, res) {
    var page = req.params.name;
    res.sendFile(path.join(__dirname + '/frontend/Templates/' + page));
});

app.get('/Assets/:name', function(req, res) {
    var page = req.params.name;
    res.sendFile(path.join(__dirname + '/frontend/Assets/' + page));
});

app.get('/js/:name', function(req, res) {
    var page = req.params.name;
    res.sendFile(path.join(__dirname + '/frontend/js/' + page));
});

app.get('/js/:folder/:name', function(req, res) {
    var page = req.params.name;
    var folder = req.params.folder;
    res.sendFile(path.join(__dirname + '/frontend/js/' + folder + '/' + page));
});

app.listen(port, function() {
  console.log(`app started on port ${port}`);
  console.log(`http://localhost:${port}`);
});