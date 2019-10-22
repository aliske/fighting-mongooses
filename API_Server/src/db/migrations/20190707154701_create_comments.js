exports.up = async function (knex, Promise) {
  return await knex.schema.createTable('comments', table => {
      table.increments('id').primary()
      table.string('comment')
      table.string('creator')
      table.integer('ideas_id').references('id').inTable('ideas')
    })
}

exports.down = async function (knex, Promise) {
  return await knex.schema.dropTable('comments')
}
