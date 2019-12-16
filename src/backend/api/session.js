db_functions = require('../db/db_functions');

express = require('express');

router = express.Router();

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function checkLogin(req, res, next) {
    if (req.session.user != null) {
      next()
    } else {
      res.json({'msg': 'Not Logged In'})
    }    
}

router.get('/seeIfLoggedIn', checkLogin, async function(req, res)
{
    if(req.session.user)
    {
        if(req.session.userType === 'Student'){
            req.session.status = await db_functions.query(`SELECT status FROM attendancelog WHERE user=${req.session.user} ORDER BY time DESC LIMIT 1`)
                                .then(function(response){
                                    return response[0].status
                                })
        } else {
            req.session.status = null
        }
        res.send({'msg': 'Logged In', 'user': req.session.user, 'fname': req.session.fname, 'lname': req.session.lname, 'type': req.session.userType, 'parent': req.session.parent, 'status': req.session.status})
    }
    else
    {
        res.json({'msg': 'Not Logged In'})
    }
});

router.post('/login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let query = `SELECT * FROM user WHERE username='${username}' AND password=PASSWORD('${password}')`;
    db_functions.query(query)
    .then(async function(resp) {
        if(resp[0] != null)
        { 
            req.session.user = resp[0].id;
            req.session.fname = resp[0].fname;
            req.session.lname = resp[0].lname;
            req.session.userType = resp[0].type;
            if(req.session.userType === 'Student'){
                req.session.status = await db_functions.query(`SELECT status FROM attendancelog WHERE user=${resp[0].id} ORDER BY time DESC LIMIT 1`)
                                    .then(function(response){
                                        return response[0].status;
                                    })
            } else {
                req.session.status = null;
            }
            req.session.parent = resp[0].parent;
            res.status(200).json({'msg': 'Logged In'});
        }
        else
        {
            res.writeHead(401);
            res.end();
        }
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}));
});

router.post('/register', function (req, res) {
    let fname = encodeHTML(req.body.fname);
    let lname = encodeHTML(req.body.lname);
    let email = encodeHTML(req.body.email);
    let type = encodeHTML(req.body.type);
    let school = encodeHTML(req.body.school);
    let grade = req.body.grade;
    let parent = req.session.user;
    let query = `INSERT INTO user(username, password, fname, lname, email, type, parent, school, grade) VALUES('${email}',PASSWORD('${fname}'),'${fname}','${lname}','${email}','${type}','${parent}','${school}','${grade}')`
    db_functions.query(query)
    .then(function(resp) {
        res.status(200).json({'msg': 'Registered', 'username': email, 'password': fname, 'id': resp['insertId']});
    })
    .catch(err => {
        if(err['errno'] === 1062){
            res.status(400).json({'msg':'Email already exists.'})
        } else {
            res.status(500).json({'msg': 'Internal Server Error'});
        }
    });
});

router.post('/register_parent', function (req, res) {
    let fname = encodeHTML(req.body.fname);
    let lname = encodeHTML(req.body.lname);
    let email = encodeHTML(req.body.email);
    let type = "Parent";
	let password = encodeHTML(req.body.password);
    let query = `INSERT INTO user(username, password, fname, lname, email, type) VALUES('${email}',PASSWORD('${password}'),'${fname}','${lname}','${email}','${type}')`;
    db_functions.query(query)
    .then(function(resp) {
        resp.status(200).json({'msg': 'Registered', 'username': email, 'password': password});
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}));
});

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

module.exports = router;
