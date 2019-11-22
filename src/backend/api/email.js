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


// send email post
router.post('/',  async (req, res) => {
  const to = req.body['to']
  const subject = req.body['subject']
  const body = req.body['body']

  // console.log(req.body)


  const mailOptions = {
    from: email, //process.env.EMAIL, // sender address
    to: to, //process.env.EMAIL, // list of receivers
    subject: subject, // Subject line
    text: body // plain text body
  };

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
