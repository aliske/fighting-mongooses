const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config()


console.log(process.env.TEST)

const pool = mysql.createPool({
  host: '35.188.30.108',
  port: '3306',
  user: "app-user",
  password: 'password2',
  database: 'db_bits_and_bytes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// db.connect(function(err) {
//   if (err) throw err;
//   console.log("database connected!");
// });


let sql = fs.readFileSync(`./src/db_bits_and_bytes.sql`, 'UTF8');

sql.split(';').forEach(query => {
  console.log(query)
  pool.query(query, function (err, result) {
    if (err) throw err;
    console.log('Result: ', result)
  })
})


// console.log(sql)
// pool.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log('Result: ', result)
// })
