// doc reference:
// https://github.com/googleapis/nodejs-storage/blob/master/samples/files.js

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
const bodyParser = require('body-parser');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage({
  projectId: 'fighting-mongooses-dev-256623',
  keyFilename: 'Fighting-Mongooses-dev-17728bdea5cf.json'
});

const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET);

// const app = express();
// app.set('view engine', 'pug');
// app.use(bodyParser.json());

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});



router.get('/', async (req, res) => {
    // [START storage_list_files]
    // Imports the Google Cloud client library

        /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    // const bucketName = 'Name of a bucket, e.g. my-bucket';

    // Lists files in the bucket
    const [files] = await bucket.getFiles();
    console.log(files);

    console.log('Files:');
    files.forEach(file => {
      console.log(file.name);
    });
    // [END storage_list_files]
  
})




// Process the file upload and upload to Google Cloud Storage.
router.post('/upload', multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

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
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});






module.exports = router
