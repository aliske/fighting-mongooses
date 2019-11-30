const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()


const users_table_name = 'user'
const middleware = require('../middleware');


// get all users
router.get('/', middleware.isAdmin, (req, res) => {
  db_functions.query(`SELECT * FROM ${users_table_name}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})




// get my profile
router.get('/me', middleware.checkLogin, (req, res) => {
  const user_id = req.session.user // TO DO: update user ID to use session.user.id

  console.log(user_id)
  db_functions.query(`SELECT id, username, type FROM ${users_table_name} WHERE id = ${user_id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// get individual user
router.get('/:id', middleware.isAdmin, (req, res) => {
  const id = req.params['id']
  db_functions.query(`SELECT * FROM users_TEST WHERE id=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// insert user
router.post('/', middleware.isAdmin, async (req, res) => {
  // param name, default value
  let name = req.body['name'] || null;
  let age = req.body['age'] || null;
  let bio = req.body['bio'] || null;


  const [rows, fields] = await db_functions.execute('INSERT INTO users_TEST (name, age, bio) VALUES (?, ?, ?)', [name, age, bio]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else 
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

// .patch   == update


// edit user
router.patch('/:id', middleware.isAdmin,async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id)
    res.status(400).json({'msg': 'Please provide a valid ID to modify'})

  // get current values
  const row = await db_functions.query(`SELECT * FROM ${users_table_name} WHERE id=${id}`)
    .then(resp => { return resp[0] })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // set update values
  let name = req.body['name'] || row.name
  let age = req.body['age'] || row.age
  let bio = req.body['bio'] || row.bio
  let registered = req.body['registered'] || row.registered


  // update db
  const [rows, fields] = await db_functions.execute(`
    UPDATE ${users_table_name}
    SET name=?, age=?, bio=? registered=?
    WHERE id=?`, [name, age, bio, id, registered]);


  if (rows.affectedRows > 0)
    res.json({'msg': 'Your data has been updated.'})
  else
    res.status(500).json({'msg': 'No update.'})
})


// delete user
router.delete('/:id', middleware.isAdmin, async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id)
    res.status(400).json({'msg': 'Please provide a valid ID to delete'})


  db_functions.query(`DELETE FROM ${users_table_name} WHERE id=${id}`)
    .then(resp => {
      if (resp.affectedRows > 0)
        res.json({'msg':'User has been deleted'})
      else
        res.json({'msg': 'User did not exist, could not delete'})
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})




module.exports = router
