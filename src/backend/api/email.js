const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer');
const middleware = require('../middleware')


const email = 'bitsandbytestesting@gmail.com'
const pass = 'tllpmpmkllgibshz'

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email, //process.env.EMAIL,
    pass: pass //process.env.EMAIL_PASSWORD
  }
});


// get all users
router.get('/groups',/* middleware.isAdmin,*/ (req, res) => {
  db_functions.query(`SELECT DISTINCT type FROM user WHERE type <> 'null'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// get user emails
router.get('/:group',/* middleware.isAdmin,*/ (req, res) => {
  const type = req.params['group']
  console.log(type)

  db_functions.query(`SELECT DISTINCT email FROM user WHERE type = '${type}' AND email <> 'null'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// send email post
router.post('/sendEmail',  async (req, res) => {
  const to = req.body['to']
  const subject = req.body['subject']
  const body = req.body['body']
  const isHTML= req.body['isHTML']


  // console.log(req.body)


  const mailOptions = {
    from: email, //process.env.EMAIL, // sender address
    to: to, //process.env.EMAIL, // list of receivers
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
