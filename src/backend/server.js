const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()



app.set('port', port)
app.use(cors())
// app.set('view engine', 'html')

// parsers
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// set headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // req.get('host')); || http://fightingmongooses.com
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
      next();
    }
});





// route to test DB functions
const test_db_functions_routes = require('./api/test_db_functions')
app.use('/api/test_db_functions/', test_db_functions_routes)
const users_routes = require('./api/users')
app.use('/api/users/', users_routes)
const announcements_routes = require('./api/announcements')
app.use('/api/announcements/', announcements_routes)


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
  console.log(`Server started on port: ${port}`)
})


