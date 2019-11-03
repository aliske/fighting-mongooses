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


// get uploaded documents
router.get('/', async (req, res) => {
    // Lists files in the bucket
    // possibly replace with SQL server
    const [files] = await bucket.getFiles();
    console.log(files);


    console.log('Files:');
    files.forEach(file => {
      console.log('https://storage.cloud.google.com/fighting-mongooses-storage-dev/' + file.name);
    });


    res.send('done')
    // [END storage_list_files]
})


router.get('/view/:filename', util_functions.validate_user, async (req, res) => {
  // TODO: validate input
  const filename = req.params['filename']

  var config = {
    action: 'read',
    expires: '03-17-2025'
  };


  const file = await bucket.file(filename)
  console.log(file.name)

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
  // content-type
  // application/pdf, image/jpeg, image/png
  // application/octet-stream


  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);

  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.

    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    // make public
    // conditional if public image vs. private .pdf
    blob.makePublic(function(err, apiResponse) {});


    // storage image URL in SQL server
    // + metadata


    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});






module.exports = router
