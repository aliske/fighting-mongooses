
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()



app.set('port', port)
app.use(cors())
// app.set('view engine', 'html')


// parsers
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


var options = {
    host: '104.155.184.169',
    port: 3306,
    user: 'app',
    password: '#&sK@4w37tUgat',
    database: 'db_bits_and_bytes'
};
 
var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'bits_and_bytes',
    secret: 'whoknowswhathtesecretshouldbeIsuredont',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));



// set headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // req.get('host')); || http://fightingmongooses.com
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
    next();
  }
});



// route to backend API
const test_db_functions_routes = require('./backend/api/test_db_functions')
app.use('/api/test_db_functions/', test_db_functions_routes)
const users_routes = require('./backend/api/users')
app.use('/api/users/', users_routes)
const announcements_routes = require('./backend/api/announcements')
app.use('/api/announcements/', announcements_routes)
const session_routes = require('./backend/api/session')
app.use('/api/session/', session_routes)


const file_routes = require('./backend/api/file')
app.use('/api/file/', file_routes)
const requiredFile_routes = require('./backend/api/required_file')
app.use('/api/required_file/', requiredFile_routes)


// route to frontend static pages
app.use(express.static('src/frontend'))



app.listen(port, function() {
  console.log(`app started on port ${port}`);
  console.log(`http://localhost:${port}`)
});


