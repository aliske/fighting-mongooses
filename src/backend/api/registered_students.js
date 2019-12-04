const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()

const users_table_name = 'user'
const middleware = require('../middleware')

// get all users whose 'parent' field is the current user
router.get('/', middleware.isParent, (req, res) => {

    const user_id = req.session.user

    console.log("GETTING STUDENTS")

    db_functions.query(`SELECT * FROM ${users_table_name} WHERE parent = ${user_id}`)
        .then(resp => { res.json(resp) })
        .catch(err => res.status(500).json({ 'msg': 'Internal Server Error' }))

    console.log(res)
})

module.exports = router