db_functions = require('../db/db_functions')

 express = require('express')
//var session = require('express-session'); 

router = express.Router()

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

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
        res.send({'msg': 'Logged In', 'user': req.session.user, 'fname': req.session.fname, 'lname': req.session.lname, 'type': req.session.type, 'parent': req.session.parent})
    }
    else
    {
        res.json({'msg': 'Not Logged In'})
    }
})

router.post('/login', function (req, res) {
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
            req.session.fname = resp[0].fname
            req.session.lname = resp[0].lname
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
})

router.post('/register', function (req, res) {
    let fname = encodeHTML(req.body.fname);
    let lname = encodeHTML(req.body.lname);
    let email = encodeHTML(req.body.email);
    let type = encodeHTML(req.body.type);
    let school = encodeHTML(req.body.school);
    let grade = req.body.grade;
    var query = `INSERT INTO user(username, password, fname, lname, email, type, school, grade) VALUES('${email}',PASSWORD('${fname}'),'${fname}','${lname}','${email}','${type}','${school}','${grade}')`
    db_functions.query(query)
    .then(function(resp) {
        res.status(200).json({'msg': 'Registered', 'username': email, 'password': fname})
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.post('/register_parent', function (req, res) {
    let fname = encodeHTML(req.body.fname);
    let lname = encodeHTML(req.body.lname);
    let email = encodeHTML(req.body.email);
    let type = "Parent";
	let password = encodeHTML(req.body.password-sign-up);
    var query = `INSERT INTO user(username, password, fname, lname, email, type) VALUES('${email}','${password}','${fname}','${lname}','${email}','${type}')`
    db_functions.query(query)
    .then(function(resp) {
        res.status(200).json({'msg': 'Registered', 'username': email, 'password': password})
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router
