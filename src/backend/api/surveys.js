const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()
const middleware = require('../middleware');

const survey_table_name = 'survey'

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// get all surveys
router.get('/', (req, res) => {
  var query = `SELECT * FROM ${survey_table_name} ORDER BY id DESC`
  db_functions.query(query)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get all surveys the current user can fill out
router.get('/by_user', middleware.checkLogin, (req, res) => {
  const user_type = req.session.userType

  // get the proper survey type name for each user type
  var survey_type;
  if (user_type == "Admin") {
    survey_type = "Admin";
  } else if (user_type == "Parent") {
    survey_type = "Parent";
  } else {
    survey_type = "Child";
  }

  db_functions.query(`SELECT * FROM ${survey_table_name} WHERE type='${survey_type}'`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get individual survey
router.get('/:id', (req, res) => {
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID'})
  db_functions.query(`SELECT * FROM ${survey_table_name} WHERE id=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.get('/questions/:id', (req, res) => {
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID'})
  db_functions.query(`SELECT * FROM survey_questions WHERE survey=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.get('/options/:id', (req, res) => {
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID'})
  db_functions.query(`SELECT * FROM question_options WHERE question=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.get('/name/:id', (req, res) => {
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID'})
  db_functions.query(`SELECT name FROM survey WHERE id=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


router.get('/responders/:id', (req, res) => {
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID'})
  db_functions.query(`SELECT DISTINCT survey_answers.user, user.fname, user.lname FROM survey_answers JOIN survey_questions ON survey_questions.id=survey_answers.question JOIN user ON survey_answers.user=user.id WHERE survey_questions.survey=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

router.get('/response/:question/:user', (req, res) => {
  const question = req.params['question'];
  const user = req.params['user'];
  if(!question || !user || !Number.isInteger(+question) || !Number.isInteger(+user))
    res.statu(400).json({'msg' : 'Please provide valid data'})
  db_functions.query(`SELECT answer FROM survey_answers WHERE user=${user} AND question=${question} ORDER BY id DESC LIMIT 1`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// insert survey
router.post('/', async (req, res) => {
  // param name, default value
  let name = encodeHTML(req.body['name']) || null;
  let startdate = req.body['startdate'];
  let enddate = req.body['enddate'];
  let type = req.body['type'] || 'Parent';

  const [rows, fields] = await db_functions.execute('INSERT INTO survey(name, startdate, enddate, type) VALUES (?, ?, ?, ?)', [name, startdate, enddate, type]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

// insert a user's survey response
router.post('/response', async (req, res) => {
  let user = req.session.user;
  let question = req.body['question'];
  let answer = req.body['answer'] || null;

  const [rows, fields] = await db_functions.execute('INSERT INTO survey_answers(user, question, answer) VALUES (?, ?, ?)', [user, question, answer]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

router.post('/question', async (req, res) => {
  // param name, default value
  let survey = req.body['survey'];
  let question = encodeHTML(req.body['question']);
  let type = req.body['type'] || 'Short Answer';

  const [rows, fields] = await db_functions.execute('INSERT INTO survey_questions(survey, question, type) VALUES (?, ?, ?)', [survey, question, type]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

router.post('/question/options', async (req, res) => {
  // param name, default value
  let question = req.body['question'];
  let option_value = encodeHTML(req.body['option_value']);

  const [rows, fields] = await db_functions.execute('INSERT INTO question_options(question, option_value) VALUES (?, ?)', [question, option_value]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

// .patch   == update




// delete announcement
router.delete('/:id', async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id || !Number.isInteger(+id))
    res.status(400).json({'msg': 'Please provide a valid ID'})

  db_functions.query(`DELETE FROM survey WHERE id=${id}`)
    .then(resp => {
      if (resp.affectedRows > 0)
        res.json({'msg':'Survey has been deleted'})
      else
        res.json({'msg': 'Survey did not exist, could not delete'})
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})




module.exports = router
