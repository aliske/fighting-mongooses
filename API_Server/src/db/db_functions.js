const fs = require('fs');
const path = require('path');
const mysql = require('mysql');

const basepath = path.resolve(__dirname);

const db = mysql.createConnection({
  host: '104.155.184.169',
  port: '3306',
  user: "app",
  password: '#&sK@4w37tUgat',
  database: 'db_bits_and_bytes'
});


db.connect(function(err) {
  if (err) throw err;
  console.log("database connected!");
});


function run_prebuilt_sql_query(filename) {
  let sql = fs.readFileSync(`${basepath}/queries/${filename}.sql`, 'UTF8');
  // console.log(sql);
  db.query(sql, function (err, result) {
    if (err) throw err;
    // console.log('Result: ', result)
  })
}



module.exports = {
  build_db: () => run_prebuilt_sql_query('build_TEST'),
  seed_db: () => run_prebuilt_sql_query('seed_TEST'),
  destroy_db: () => run_prebuilt_sql_query('destroy_TEST')
}


