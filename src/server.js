
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




// route to backend API
const test_db_functions_routes = require('./backend/api/test_db_functions')
app.use('/api/test_db_functions/', test_db_functions_routes)
const users_routes = require('./backend/api/users')
app.use('/api/users/', users_routes)


// route to frontend static pages
app.use(express.static('src/frontend'))



app.listen(port, function() {
  console.log(`app started on port ${port}`);
  console.log(`http://localhost:${port}`)
});


