const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()


const users_table_name = 'users_TEST'



// get all users
router.get('/', (req, res) => {
  db_functions.query(`SELECT * FROM ${users_table_name}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get individual user
router.get('/:id', (req, res) => {
  const id = req.params['id']
  db_functions.query(`SELECT * FROM users_TEST WHERE id=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// insert user
router.post('/', async (req, res) => {
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


// insert user
router.patch('/:id', async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id)
    res.status(400).json({'msg': 'Please provide a valid ID to modify'})

  // get current values
  const row = await db_functions.query(`SELECT * FROM users_TEST WHERE id=${id}`)
    .then(resp => { return resp[0] })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // set update values
  let name = req.body['name'] || row.name
  let age = req.body['age'] || row.age
  let bio = req.body['bio'] || row.bio


  // update db
  const [rows, fields] = await db_functions.execute(`
    UPDATE users_TEST
    SET name=?, age=?, bio=?
    WHERE id=?`, [name, age, bio, id]);


  if (rows.affectedRows > 0)
    res.json({'msg': 'Your data has been updated.'})
  else
    res.status(500).json({'msg': 'No update.'})
})


// delete user
router.delete('/:id', async (req, res) => {
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