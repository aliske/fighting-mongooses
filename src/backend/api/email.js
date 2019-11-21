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
router.post('/', middleware.isAdmin, async (req, res) => {
  const to = req.body['to']
  const subject = req.body['subject']
  const body = req.body['body']


  const mailOptions = {
    from: email, //process.env.EMAIL, // sender address
    to: to, //process.env.EMAIL, // list of receivers
    subject: subject, // Subject line
    text: body // plain text body
  };


  // send email
  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  });



// ?emailAddress=alecjmaly@gmail.com&emailPassword=....
  try {
    html = await getDataHTML();
    sendEmail(html, req.body.emailAddress, req.body.emailPassword);
    res.send('success')
  } catch {
    res.send('failed')
  }
})





module.exports = router
