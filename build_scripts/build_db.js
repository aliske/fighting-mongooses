const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config()


console.log(process.env.DB_HOST)
console.log(process.env.DB_USERNAME)
console.log(process.env.DB_USERPASS)
console.log(process.env.DB_NAME)

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: '3306',
  user: process.env.DB_USERNAME,
  password: process.env.DB_USERPASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// let db = mysql.createConnection({user: process.env.DB_USERNAME, database: process.env.DB_NAME, password: process.env.DB_USERPASS, host: process.env.DB_HOST});


// sql.split(';').forEach(query => {
//   pool.query(query.trim(), function (err, result) {
//     if (err) throw err;
//     console.log('Result: ', result)
//   })
// })

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


const start = async () => {
  let sql = fs.readFileSync(`./src/backend/db/queries/db_bits_and_bytes.sql`, 'UTF8');
  sql = sql.trim().split(';')
  sql.push(`INSERT INTO user (username, fname, password, type) VALUES ('admin', 'admin', PASSWORD('1234'), 'Admin')`)


  await asyncForEach(sql, async (query) => {
    await new Promise(resolve => {
      console.log('Executing: "' + query.trim() + '"')
      if (query == undefined || query == null || query == '') {
        return resolve()
      }
      pool.query(query.trim(), function (err, result) {
        // if (err) throw err
        console.log('Result: ', result)
        resolve()
      })
    })
  })


  console.log('Done');

  return pool.end()
}


start();

