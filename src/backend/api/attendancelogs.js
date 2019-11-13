const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

router.get('/status', (req, res) => {
  var query = `SELECT user.fname, user.lname, logs.time, logs.status
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

module.exports = router
