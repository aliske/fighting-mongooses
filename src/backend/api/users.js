const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()


const users_table_name = 'user'
const middleware = require('../middleware');


// get all users
router.get('/', middleware.isAdmin, (req, res) => {
  db_functions.query(`SELECT * FROM ${users_table_name} ORDER BY registered DESC` )
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get a subset of users by type
router.get('/byType/:type', middleware.isAdmin, (req, res) => {
  const type = req.params['type']
  db_functions.query(`SELECT * FROM ${users_table_name} WHERE type='${type.toLowerCase()}'`)
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
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID'})
  db_functions.query(`SELECT * FROM ${users_table_name} WHERE id=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// insert user
router.post('/', middleware.isAdmin, async (req, res) => {
  // param name, default value
  let name = req.body['name'] || null;
  let age = req.body['age'] || null;
  let bio = req.body['bio'] || null;


  const [rows, fields] = await db_functions.execute('INSERT INTO ${users_table_name} (name, age, bio) VALUES (?, ?, ?)', [name, age, bio]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else 
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

// .patch   == update

// unenroll user
router.patch('/unenroll/:id', middleware.isAdmin,async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID to modify'})

  // get current values
  const row = await db_functions.query(`SELECT * FROM ${users_table_name} WHERE id=${id}`)
    .then(resp => { return resp[0] })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // set update values
  let registered = req.body['registered']

  // update db
  const [rows, fields] = await db_functions.execute(`
    UPDATE ${users_table_name}
    SET registered=?
    WHERE id=?`, [registered, id]);


  if (rows.affectedRows > 0)
    res.json({'msg': 'Your data has been updated.'})
  else
    res.status(500).json({'msg': 'No update.'})
})



// enroll user
router.patch('/enroll/:id', middleware.isAdmin,async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID to modify'})

  // get current values
  const row = await db_functions.query(`SELECT * FROM ${users_table_name} WHERE id=${id}`)
    .then(resp => { return resp[0] })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // set update values
  let registered = req.body['registered'] || row.registered

  // update db
  const [rows, fields] = await db_functions.execute(`
    UPDATE ${users_table_name}
    SET registered=?
    WHERE id=?`, [registered, id]);


  if (rows.affectedRows > 0)
    res.json({'msg': 'Your data has been updated.'})
  else
    res.status(500).json({'msg': 'No update.'})
})


// edit user
router.patch('/:id', middleware.isAdmin, async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID to modify'})

  // get current values
  const row = await db_functions.query(`SELECT * FROM ${users_table_name} WHERE id=${id}`)
    .then(resp => { return resp[0] })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // set update values
  let fname = req.body['fname'] || row.fname
  let lname = req.body['lname'] || row.lname
  let email = req.body['email'] || row.email
  let addr_line1 = req.body['addr_line1'] || row.addr_line1
  let addr_line2 = req.body['addr_line2'] || row.addr_line2
  let addr_city = req.body['addr_city'] || row.addr_city
  let addr_state = req.body['addr_state'] || row.addr_state
  let addr_zip = req.body['addr_zip'] || row.addr_zip
  let birthdate = req.body['birthdate'] || row.birthdate
  let school = req.body['school'] || row.school
  let grade = req.body['grade'] || row.grade


  // update db
  const [rows, fields] = await db_functions.execute(`
    UPDATE ${users_table_name}
    SET fname=?, lname=?, email=?, addr_line1=?, addr_line2=?, addr_city=?, addr_state=?, addr_zip=?, birthdate=?, school=?, grade=?
    WHERE id=?`, [fname, lname, email, addr_line1, addr_line2, addr_city, addr_state, addr_zip, birthdate, school, grade, id]);


  if (rows.affectedRows > 0)
    res.json({'msg': 'Your data has been updated.'})
  else
    res.status(500).json({'msg': 'No update.'})
})


// delete user
router.delete('/:id', middleware.isAdmin, async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
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
