const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer');
const middleware = require('../middleware')
require('dotenv').config()

const email = process.env.EMAIL_ADDRESS || 'bitsandbytestesting@gmail.com'
const pass = process.env.EMAIL_APP_PASSWORD || 'tllpmpmkllgibshz'



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email, //process.env.EMAIL,
    pass: pass //process.env.EMAIL_PASSWORD
  }
});

// get years
router.get('/years', middleware.isAdmin, (req, res) => {
  db_functions.query(`SELECT DISTINCT registered FROM user WHERE registered <> 'null'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get all users
router.get('/users/:type/:year', middleware.isAdmin, (req, res) => {
  const type = req.params['type']
  const year = req.params['year']

  db_functions.query(`SELECT email,type,fname,lname FROM user WHERE email <> 'null' AND type = '${type}' AND registered = '${year}'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// get all users
router.get('/types', middleware.isAdmin, (req, res) => {
  db_functions.query(`SELECT DISTINCT type FROM user WHERE type <> 'null'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// get user emails
router.get('/types/:type/users', middleware.isAdmin, (req, res) => {
  const type = req.params['type']
  console.log(type)

  db_functions.query(`SELECT DISTINCT email,type,fname,lname FROM user WHERE type = '${type}' AND email <> 'null'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get user emails
router.get('/types/:type', middleware.isAdmin, (req, res) => {
  const type = req.params['type']
  console.log(type)

  db_functions.query(`SELECT DISTINCT email FROM user WHERE type = '${type}' AND email <> 'null'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// send email post
router.post('/sendEmail',  middleware.isAdmin,  async (req, res) => {
  const to = req.body['to']
  const cc = req.body['cc']
  const bcc = req.body['bcc']
  const subject = req.body['subject']
  const body = req.body['body']
  const isHTML= req.body['isHTML']


  // console.log(req.body)


  const mailOptions = {
    from: email, //process.env.EMAIL, // sender address
    to: to, //process.env.EMAIL, // list of receivers
    cc: cc,
    bcc: bcc,
    subject: subject, // Subject line
  };

  if (isHTML)
    mailOptions.html = body // plain text body
  else
    mailOptions.text = body



// ?emailAddress=alecjmaly@gmail.com&emailPassword=....
  try {
    // send email
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        res.status(500).json({'msg': 'failed'})
      else
        res.status(200).json({'msg': 'success', sentTo: info.accepted})
    });

  } catch {
    res.status(500).json({'msg': 'failed'})
  }
})








module.exports = router
