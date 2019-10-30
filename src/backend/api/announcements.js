const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()


const announcements_table_name = 'announcements'

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// get all announcements, with optional LIMIT and OFFSET
router.get('/', (req, res) => {
  var query = `SELECT * FROM announcements`
  //if(req.query.limit !== "undefined")
  //{
  //  query = query + ' LIMIT ' + req.query.limit
  //  if(req.query.offset !== "undefined")
  //  {
  //    query = query + ' OFFSET ' + req.query.offset
  //  }
  //}
    db_functions.query(query)
      .then(resp => { res.json(resp) })
      .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get individual announcement
router.get('/:id', (req, res) => {
  const id = req.params['id']
  db_functions.query(`SELECT * FROM ${announcements_table_name} WHERE id=${id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// insert announcement
router.post('/', async (req, res) => {
  // param name, default value
  let title = encodeHTML(req.body['title']) || null;
  let announcement = encodeHTML(req.body['announcement']) || null;
  let author = encodeHTML(req.body['author']) || 1;

  const [rows, fields] = await db_functions.execute('INSERT INTO announcements(title, announcement, author) VALUES (?, ?, ?)', [title, announcement, author]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else 
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})

// .patch   == update


// update announcement
router.patch('/:id', async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id)
    res.status(400).json({'msg': 'Please provide a valid ID to modify'})

  // get current values
  const row = await db_functions.query(`SELECT * FROM ${announcements_table_name} WHERE id=${id}`)
    .then(resp => { return resp[0] })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // set update values
  let title = encodeHTML(req.body['title']) || row.title
  let announcement = encodeHTML(req.body['announcement']) || row.announcement


  // update db
  const [rows, fields] = await db_functions.execute(`
    UPDATE announcements
    SET title=?, announcement=? 
    WHERE id=?`, [title, announcement, id]);


  if (rows.affectedRows > 0)
    res.json({'msg': 'Your announcement has been updated.'})
  else
    res.status(500).json({'msg': 'No update.'})
})


// delete announcement
router.delete('/:id', async (req, res) => {
  // param name, default value
  const id = req.params['id']
  if (!id)
    res.status(400).json({'msg': 'Please provide a valid ID to delete'})


  db_functions.query(`DELETE FROM announcements WHERE id=${id}`)
    .then(resp => {
      if (resp.affectedRows > 0)
        res.json({'msg':'Announcement has been deleted'})
      else
        res.json({'msg': 'Announcement did not exist, could not delete'})
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})




module.exports = router
