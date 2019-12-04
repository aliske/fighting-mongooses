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
require('dotenv').config()

// my variables
// const GCLOUD_STORAGE_BUCKET = 'fighting-mongooses-storage-dev'
const GCLOUD_STORAGE_BUCKET = process.env.GCLOUD_STORAGE_BUCKET || 'fighting-mongooses-storage-dev'


const {format} = require('util');
const Multer = require('multer');
const middleware = require('../middleware');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');
const request = require('request');
// Instantiate a storage client
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID || 'fighting-mongooses-dev-256623',
  keyFilename: process.env.GCLOUD_STORAGE_KEY_FILEPATH || 'Fighting-Mongooses-dev-17728bdea5cf.json'
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



const files_table_name = 'file'

// user this query
// SELECT uuid,mimetype FROM ${files_table_name} WHERE public = 1
async function collectFileUrlsFromGoogle(resp) {

  const minutes_to_expire = 5
  const exp_date = new Date((new Date()).getTime() + minutes_to_expire*60000)

  var config = {
    action: 'read',
    expires: exp_date  // TO DO: update expire date/time
  };

  // collect urls
  let file_promises = []
  resp.forEach((file) => {
    const file_promise = new Promise((resolve, reject) => {
      bucket
      .file(file.uuid)
      .getSignedUrl(config, function(err, url) {
        if (err) {
          console.error(err);
          return;
        }

        resolve({
          url: url,
          mimetype: file.mimetype
        })
      });
    }).catch(err => console.log(err))

    // console.log(url)
    file_promises.push(file_promise)
  })

  return await Promise.all(file_promises).then(resp => { return resp })
}



// get all public files
router.get('/public', middleware.checkLogin, (req, res) => {
  db_functions.query(`SELECT ${files_table_name}.id,
	user.username AS 'user',
	${files_table_name}.uuid,
	${files_table_name}.public,
	requiredfile.title AS 'requiredfile',
	${files_table_name}.mimetype,
	${files_table_name}.cdate
	FROM ${files_table_name}
	LEFT JOIN requiredfile ON requiredfile.id=file.requiredfile
	LEFT JOIN user ON user.id=file.user
	WHERE public = 1`)
//  db_functions.query(`SELECT * FROM ${files_table_name} WHERE public = 1`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// get all public file content
router.get('/content/public', middleware.checkLogin, async (req, res) => {
  db_functions.query(`SELECT uuid,mimetype FROM ${files_table_name} WHERE public = 1`)
    .then(async resp => {
      const file_urls = await collectFileUrlsFromGoogle(resp)

      res.status(200).json(file_urls)
    })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})

// combine FILES
// https://cloud.google.com/nodejs/docs/reference/storage/1.3.x/Bucket



// get my files
router.get('/me', middleware.checkLogin, (req, res) => {
  const user_id = req.session.user // TO DO: update user ID to use session.user.id
// replace required number with description
   db_functions.query (`SELECT ${files_table_name}.id,
	user.username AS 'user',
	${files_table_name}.uuid,
	${files_table_name}.public,
	requiredfile.title AS 'requiredfile',
	${files_table_name}.mimetype,
	${files_table_name}.cdate
	FROM ${files_table_name}
	LEFT JOIN requiredfile ON requiredfile.id=file.requiredfile
	LEFT JOIN user ON user.id=file.user
	WHERE ${files_table_name}.user = ${user_id}`)
   //  db_functions.query(`SELECT * FROM ${files_table_name} WHERE user = ${user_id}`)
    .then(resp => { res.json(resp) })
    .catch(err => res.status(500).json({'msg': 'Internal Server Error'}))
})


// get file: works for pdfs
router.get('/:uuid', middleware.checkLogin, async (req, res) => {
  // TODO: validate user
  const file_uuid = req.params['uuid']

  // validate user permissions....
  // check DB if they are the user is the owner of this file OR is an admin

  // note, this may cause issues with timezones
  const minutes_to_expire = 5
  const exp_date = new Date((new Date()).getTime() + minutes_to_expire*60000)

  var config = {
    action: 'read',
    expires: exp_date  // TO DO: update expire date/time
  };

  const file = await bucket.file(file_uuid)
  file.getSignedUrl(config, function(err, url) {
    if (err) {
      console.error(err);
      return;
    }

    // The file is now available to read from this URL.
    request(url, function(err, resp) {
      if (err) 
        res.status(500).json({'msg': 'Internal Server Error'})

      // resp.statusCode = 200
      console.log(url)
      res.json({'url': url})
    });
  });
})



// Process the file upload and upload to Google Cloud Storage.
router.post('/upload', middleware.checkLogin, multer.single('file'), (req, res, next) => {
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

    // update database
    const user = req.session.user; // TO DO: change to user logged in. session.user.id
    const mimetype = req.file.mimetype
    const filename = req.file.originalname || null;
    const public = req.body['isPublic'] === 'true' && req.session.type === 'Admin' ? 1 : 0;
    const requiredFile = req.body['requiredFile'] || null

    if (public === 1 && mimetype.split('/')[0] !== 'image') {
      res.status(500).json({'msg': 'Please upload an image.'})
      return
    }


    // set metadata: content-type (content-type: application/pdf, image/jpeg, image/png...)
    var metadata = {
      contentType: req.file.mimetype,
      metadata: {
        originalname: filename,
        ownerID: user
      }
    };

    blob.setMetadata(metadata, function(err, apiResponse) {
      // make public
      // conditional if public image vs. private .pdf
      // if (public === 1)
      //   blob.makePublic(function(err, apiResponse) {});

    });



    // update database
    const [rows, fields] = await db_functions.execute(`INSERT INTO ${files_table_name}(user, uuid, public, requiredfile, mimetype) VALUES (?, ?, ?, ?, ?)`, [user, file_uuid, public, requiredFile, mimetype]);

    if (rows.insertId) {
      // res.status(200).json({''insertID': rows.insertId'})
      res.redirect(req.header('Referer'))
    }
    else
      res.status(500).json({'msg': 'Internal Server Error. Please check your query parameters.'})

    // res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});





// get file: works for pdfs
// TO DO: allow admin delete?
router.delete('/:uuid', middleware.checkLogin, async (req, res) => {
  // TODO: validate input
  const user_id = req.session.user // TO DO: pull from session
  const file_uuid = req.params['uuid']


  let query;
  if (req.session.type === 'Admin')
    query = `DELETE FROM ${files_table_name} WHERE uuid = ?`
  else
    query = `DELETE FROM ${files_table_name} WHERE uuid = ? AND user = ${user_id}`


  // delete from db
  await db_functions.execute(query, [file_uuid])
    .then(async(qry_output) => {
      if (parseInt(qry_output[0].affectedRows) == 0)
        throw 'No file was deleted, user does not have permissions or file does not exist'
        // delete from Google cloud
      await bucket.file(file_uuid).delete()
        .then(() => { res.status(200).json({'msg': 'File deleted successfully'}) })
        .catch(err => { res.status(500).json({'msg': 'Failed to delete file, you may not have permissions.'}) })
    })
    .catch(err => res.status(500).json({'msg': 'Failed to delete file, you may not have permissions.'}))


})





module.exports = router
