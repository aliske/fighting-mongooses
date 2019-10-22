exports.up = async function (knex, Promise) {
  return await knex.schema.createTable('ideas', table => {
      table.increments('id').primary()
      table.string('idea')
      table.string('creator')
    })
}

exports.down = async function (knex, Promise) {
  return await knex.schema.dropTable('ideas')
}
