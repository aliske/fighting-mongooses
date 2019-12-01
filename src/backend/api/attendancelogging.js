const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

router.get('/history/:user', (req, res) => {
  const user = req.params['user']
  console.log("This is the user: " + user)
  var query = `SELECT a.time, a.status, u.fname, u.lname
               FROM user u
                        JOIN attendancelog a on u.id = a.user AND u.id=${user};`

    db_functions.query(query)
      .then(resp => { res.json(resp) })
      .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.get('/status', (req, res) => {
  var query = `SELECT user.id, user.fname, user.lname, logs.time, logs.status
               FROM (
                   SELECT logs1.status, logs1.time, logs1.user
                   FROM attendancelog logs1 LEFT JOIN attendancelog logs2
                       ON (logs1.user = logs2.user AND logs1.time < logs2.time)
                   WHERE logs2.time IS NULL
               ) AS logs
               JOIN user on user.id = logs.user;`
    db_functions.query(query)
      .then(resp => { res.json(resp) })
      .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.post('/checkinout', async (req, res) => {
    let user = req.body['user'];
    let status =  req.body['status'];

    const [rows, fields] = await db_functions.execute('INSERT INTO attendancelog (user, status) VALUES (?, ?)', [user, status]);

    if (rows.insertId)
        res.json({'insertID': rows.insertId})
    else
        res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

module.exports = router
