const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config()


console.log(process.env.TEST)

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

let db = mysql.createConnection({user: process.env.DB_USERNAME, database: process.env.DB_NAME, password: process.env.DB_USERPASS, host: process.env.DB_HOST});


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
  let sql = fs.readFileSync(`./src/db_bits_and_bytes.sql`, 'UTF8');

  await asyncForEach(sql.trim().split(';'), async (query) => {
    await new Promise(resolve => {
      console.log('Executing: ', query.trim())
      if (query == undefined || query == null || query.trim() == '')
        resolve()

      pool.query(query.trim(), function (err, result) {
        // if (err) throw err
        console.log('Result: ', result)
        resolve()
      })
    })
  });

  pool.query(`INSERT INTO user (username, password, type) VALUES ('admin', PASSWORD('1234'), 'admin')`)

  console.log('Done');
}
start();

