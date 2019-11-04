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



const files_table_name = 'files_TEST'

// get all public files
router.get('/public', (req, res) => {
  db_functions.query(`SELECT * FROM ${files_table_name} WHERE public = 1`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// get my files
router.get('/me', (req, res) => {
  const user_id = 1 // TO DO: update user ID to use session.user.id

  db_functions.query(`SELECT * FROM ${files_table_name} WHERE author = ${user_id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// get file: works for pdfs
router.get('/:uuid', util_functions.validate_user_permissions, async (req, res) => {
  // TODO: validate user
  const file_uuid = req.params['uuid']

  var config = {
    action: 'read',
    expires: '03-17-2025' // TO DO: update expire date/time
  };


  const file = await bucket.file(file_uuid)

  file.getSignedUrl(config, function(err, url) {
    if (err) {
      console.error(err);
      return;
    }

    // The file is now available to read from this URL.
    request(url, function(err, resp) {
      // resp.statusCode = 200
      console.log(url)
      res.send(url)
    });
  });
})



// Process the file upload and upload to Google Cloud Storage.
router.post('/upload', multer.single('file'), (req, res, next) => {
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
    const author = 1; // TO DO: change to user logged in. session.user.id
    const filetype = req.file.mimetype
    const filename = req.file.originalname || null;
    const file_url = publicUrl || null;
    const public = req.body['public'] === 'true' ? 1 : 0;


    // set metadata: content-type (content-type: application/pdf, image/jpeg, image/png...)
    var metadata = {
      contentType: req.file.mimetype,
      metadata: {
        originalname: filename,
        ownerID: author
      }
    };

    blob.setMetadata(metadata, function(err, apiResponse) {
      // make public
      // conditional if public image vs. private .pdf
      if (public === 1)
        blob.makePublic(function(err, apiResponse) {});

    });



    // update database
    const [rows, fields] = await db_functions.execute(`INSERT INTO ${files_table_name}(author, uuid, filename, file_url, filetype, public) VALUES (?, ?, ?, ?, ?, ?)`, [author, file_uuid, filename, file_url, filetype, public]);

    if (rows.insertId)
      // res.status(200).json({'insertID': rows.insertId})
      res.redirect('/StaticPages/upload_page.html')
    else
      res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})

    // res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});



// get file: works for pdfs
router.delete('/:uuid', util_functions.validate_user_permissions, async (req, res) => {
  // TODO: validate input
  const user_id = 1 // TO DO: pull from session
  const file_uuid = req.params['uuid']

  // delete from db
  await db_functions.execute(`DELETE FROM ${files_table_name} WHERE author = ? AND uuid = ?`, [user_id, file_uuid])
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))

  // delete from Google cloud
  await bucket.file(file_uuid).delete()
    .then(() => { res.json({'msg': 'Complete'}) })
    .catch(err => { res.status(500).json({'msg': 'Internal Server Error'}) })

})





module.exports = router
