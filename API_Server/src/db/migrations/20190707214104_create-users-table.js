exports.up = async function(knex, Promise) {
  return await knex.schema.createTable('TEST_users', table => {
    table.increments('id').primary()
    table.string('username').unique()
    table.string('token')
    table.string('password_digest')



    // let createQuery = `CREATE TABLE users(
    //   id SERIAL PRIMARY KEY NOT NULL,
    //   username TEXT,
    //   token TEXT,
    //   password_digest TEXT,
    //   created_at TIMESTAMP
    // )`;

    // return knex.raw(createQuery);
  })
};

exports.down = async function(knex, Promise) {
  return await knex.schema.dropTable('TEST_users')
};
