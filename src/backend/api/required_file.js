// doc reference:
// https://github.com/googleapis/nodejs-storage/blob/master/samples/files.js
// https://cloud.google.com/appengine/docs/standard/nodejs/using-cloud-storage

// client ID
// 1026950722448-4c7t25nima768oh0qgoevsn58n0elnbr.apps.googleusercontent.com

// client SECRET
// EE2LuletWc9Zo5wJaHsBUqKR


const db_functions = require('../db/db_functions')
const express = require('express')
const router = express.Router()
const uuid = require('uuid4')

// my variables
const GCLOUD_STORAGE_BUCKET = 'fighting-mongooses-storage-dev'


const {format} = require('util');
const Multer = require('multer');
const util_functions = require('../util');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');
const request = require('request');
// Instantiate a storage client
const storage = new Storage({
  projectId: 'fighting-mongooses-dev-256623',
  keyFilename: 'Fighting-Mongooses-dev-17728bdea5cf.json'
});
const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET);

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});
// router.use(multer.array())



const files_table_name = 'requiredfile'

// get all public files
router.get('/', util_functions.checkLogin, (req, res) => {
  db_functions.query(`SELECT * FROM ${files_table_name}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// get my completed files
router.get('/me', util_functions.checkLogin, (req, res) => {
  const user_id = req.session.user // TO DO: update user ID to use session.user.id
  console.log(user_id)
  db_functions.query(`SELECT id, title
    FROM requiredfile
    WHERE id IN (SELECT requiredfile FROM file WHERE user = ${user_id} AND requiredfile IS NOT NULL)`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// get my not-complete files
router.get('/me/todo', util_functions.checkLogin, (req, res) => {
  const user_id = req.session.user // TO DO: update user ID to use session.user.id

  db_functions.query(`SELECT id, title
      FROM requiredfile
      WHERE id NOT IN (SELECT requiredfile FROM file WHERE user = ${user_id} AND requiredfile IS NOT NULL)
          `)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})



// Process the file upload and upload to Google Cloud Storage.
router.post('/upload', util_functions.isAdmin, multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  const file_uuid = uuid()
  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(file_uuid) //.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', async () => {
    // The public URL can be used to directly access the file via HTTP.

    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    // update database
    const user = req.session.user; // TO DO: change to user logged in. session.user.id
    const mimetype = req.file.mimetype
    const title = req.body['title'] || req.file.originalname
    const description = req.body['description'] || ''
    const public = 1


    // set metadata: content-type (content-type: application/pdf, image/jpeg, image/png...)
    var metadata = {
      contentType: req.file.mimetype,
      metadata: {
        type: 'requiredfile',
        title: title,
        description: description
      }
    };

    blob.setMetadata(metadata, function(err, apiResponse) {
      // make public
      // conditional if public image vs. private .pdf
      if (public === 1)
        blob.makePublic(function(err, apiResponse) {});

    });



    // update database
    const [rows, fields] = await db_functions.execute(`INSERT INTO ${files_table_name}(uuid, title, description, mimetype) VALUES (?, ?, ?, ?)`, [file_uuid, title, description, mimetype]);

    if (rows.insertId)
      // res.status(200).json({'insertID': rows.insertId})
      res.redirect('/StaticPages/admin_required_files.html')
    else
      res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})

    // res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});



// get file: works for pdfs
router.delete('/:uuid', util_functions.isAdmin, async (req, res) => {
  // TODO: validate input
  const file_uuid = req.params['uuid']

  // delete from db
  await db_functions.execute(`DELETE FROM ${files_table_name} WHERE uuid = ?`, [file_uuid])
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // delete from Google cloud
  await bucket.file(file_uuid).delete()
    .then(() => { res.json({'msg': 'Complete'}) })
    .catch(err => { res.status(500).json({'msg': 'Internal Server Error'}) })

})





module.exports = router