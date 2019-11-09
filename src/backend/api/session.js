db_functions = require('../db/db_functions')

 express = require('express')
//var session = require('express-session'); 

router = express.Router()



function checkLogin(req, res, next) {
  //console.log(req.session)

    if (req.session.user != null) {
      //res.json({'msg': req.session.name + ' Logged In'})
      next()
    } else {
      res.json({'msg': 'Not Logged In'})
    }    
}


router.get('/seeIfLoggedIn', checkLogin, function(req, res)
{
    if(req.session.user)
    {
        res.json({'msg': 'Logged In', 'user': req.session.user, 'name': req.session.name, 'type': req.session.type, 'parent': req.session.parent})
    }
    else
    {
        res.json({'msg': 'Not Logged In'})
    }
})

router.post('/login', function (req, res, next) {

    console.log("got here")
    let username = req.body.username;
    let password = req.body.password;
    console.log(username + " " + password)
    var query = `SELECT * FROM user WHERE username='${username}' AND password=PASSWORD('${password}')`
    db_functions.query(query)
    .then(function(resp) {
        if(resp[0] != null)
        { 
            req.session.user = resp[0].id
            req.session.name = resp[0].fname + " " + resp[0].lname
            req.session.type = resp[0].type
            req.session.parent = resp[0].parent
            // res.status(200).json({'msg': 'Logged In'})
            res.cookie('type',req.session.type, { maxAge: 900000 });
            res.redirect('/')
        }
        else
        {
            res.redirect('/StaticPages/login_form.html')
        }
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



module.exports = router
