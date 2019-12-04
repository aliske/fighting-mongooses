const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()


router.get('/build', (req, res) => {
  db_functions.build_db();
  res.json({'msg': 'test tables have been built'})
})

router.get('/seed', (req, res) => {
  db_functions.seed_db();
  res.json({'msg': 'test tables have been seeded'})
})

router.get('/destroy', (req, res) => {
  db_functions.destroy_db();
  res.json({'msg': 'test tables have been destroyed'})
})



module.exports = router
