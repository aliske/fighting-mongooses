const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const basepath = path.resolve(__dirname);

const pool = mysql.createPool({
  host: '35.188.30.108',
  port: '3306',
  user: "app-user",
  password: 'password2',
  database: 'bits-and-bytes-db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// db.connect(function(err) {
//   if (err) throw err;
//   console.log("database connected!");
// });


function run_prebuilt_sql_query(filename) {
  let sql = fs.readFileSync(`${basepath}/queries/${filename}.sql`, 'UTF8');
  // console.log(sql);
  pool.query(sql, function (err, result) {
    // if (err) throw err;
    // console.log('Result: ', result)
  })
}

async function query(sql) {
  const data = await pool.execute(sql);
  return data[0];
}

async function execute(sql, params) {
  // const data = await pool.execute(sql, params);
  return await pool.execute(sql, params)
}



module.exports = {
  build_db: () => run_prebuilt_sql_query('build_TEST'),
  seed_db: () => run_prebuilt_sql_query('seed_TEST'),
  destroy_db: () => run_prebuilt_sql_query('destroy_TEST'),
  query: (sql) => query(sql),
  execute: (sql, params) => execute(sql, params)
}


