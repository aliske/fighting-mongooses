require('dotenv').config()

const mysql = require('mysql')
// enable SSL when connecting to prod database
// mysql.defaults.ssl = false     // ????????


module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '104.155.184.169',
      port: '3306',
      user: 'root',
      password: 'vgP1gj1Fn7ArcgA9',
      database: 'db_bits_and_bytes'
    },
    migrations: {
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    },
    useNullAsDefault: true
  },

  test: {},

  production: {}
};
