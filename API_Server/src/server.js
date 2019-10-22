const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');

// jwt secrets
const publicKey = fs.readFileSync('./public.key');
const privateKey = fs.readFileSync('./private.key');




// const ideas = require('./controllers/ideas')

require('dotenv').config()


const app = express()
const port = process.env.PORT || 3000

app.set('port', port)
app.use(cors())
// app.set('view engine', 'html')

// parsers
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())


// set headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  // res.header('Access-Control-Allow-Origin', 'http://fightingmongooses.com'); // req.get('host')); || http://fightingmongooses.com
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
      next();
    }
});



// add & configure session middleware
const session = require('express-session')
const crypto = require('crypto');

app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return crypto.randomBytes(16).toString("hex"); // session ID
      //crypto.randomBytes(3*4).toString('base64') session IDs
  },
  secret: 'keyboard cat',
  resave: false, // check setting
  saveUninitialized: true, // check setting
  proxy: true,
  // cookie: {
  //   domain: '.localhost'
  // }
}))






// custom login
const UserFunctions = require('./auth/controllers/user-custom')
app.post('/signup', UserFunctions.signup)




const passportFunctions = require('./auth/middlewares/misc')(jwt, privateKey)
const { findOrCreateExternalUser } = require ('./auth/controllers/users')
const authFunctions = {}
authFunctions.passportFunctions = passportFunctions
authFunctions.findOrCreateExternalUser = findOrCreateExternalUser







// // user model
// const { User } = require('../db/models/schema')
// // app.use('/ideas', ideas)

// app.get('/users', isLoggedIn, async (req, res) => {
//   const users = await User.query()
//   res.json(users)
// })



// route homepage
app.get('/', (req, res) => {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)


  res.send(`Server running on port ${port}`)

  // res.send(`You hit home page!\n`)
})



app.get('*', function(req, res){
  console.log('host: ' + req.get('host'))
  res.status('404').send('Page not found, bruh')
});


app.listen(app.get('port'), () => {
  console.log('env root: ' + process.env.ROOT_DOMAIN)
  console.log(`Server started on port: ${port}`)
})


