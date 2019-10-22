exports.up = async function (knex, Promise) {
  return await knex.schema.createTable('TEST_ideas', table => {
      table.increments('id').primary()
      table.string('idea')
      table.string('creator')
    })
}

exports.down = async function (knex, Promise) {
  return await knex.schema.dropTable('TEST_ideas')
}
