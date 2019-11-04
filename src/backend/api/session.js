 db_functions = require('../db/db_functions')

 express = require('express')
//var session = require('express-session'); 

router = express.Router()



function checkLogin(req, res, next) {
  console.log(req.session)

    if (req.session.user != null) {
      // you are logged in
        console.log("Session Set: " + req.session.user + " " + req.session.name + " " + req.session.type + " " + req.session.parent)
       next()
    } else {
      res.redirect('../../index.html');
    }    
}


router.get('/seeIfLoggedIn', checkLogin, function(req, res)
{
    if(req.session.user)
    {
        res.json({'msg': 'Logged In', user: req.session.user, name: req.session.name, type: req.session.type, parent: req.session.parent})
    }
    else
    {
        res.json({'msg': 'Not Logged In'})
    }
})

router.post('/login', checkLogin, function (req, res, next) {
    if(!req.session.user)
    {
        let username = req.body.username;
        let password = req.body.password;
        console.log(username + " " + password)
        var query = `SELECT * FROM users WHERE username='${username}' AND password=PASSWORD('${password}')`
        db_functions.query(query)
        .then(function(resp) {
            if(resp[0] != null)
            { 
                req.session.user = resp[0].id
                req.session.name = resp[0].fname + " " + resp[0].lname
                req.session.type = resp[0].type
                req.session.parent = resp[0].parent
                res.status(200).json({'msg': 'Logged In'})
            }
            else
            {
                res.end()
            }
        })
        .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
    }
})



module.exports = router
