const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()


const upload_files_table_name = 'images'

// insert images
router.post('/', async (req, res) => {
  // param name, default value
  let filename = req.body['impfile'] || null;
  let fileblob = req.body['dispimage'] || null;
  let author = req.body['author'] || 1;

  const [rows, fields] = await db_functions.execute('INSERT INTO images(author, filename, blob) VALUES (?, ?, ?)', [author, filename, fileblob]);

  if (rows.insertId)
    res.json({'insertID': rows.insertId})
  else 
    res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})
})





module.exports = router
