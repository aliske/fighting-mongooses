exports.up = async function (knex, Promise) {
  return await knex.schema.createTable('TEST_comments', table => {
      table.increments('id').primary()
      table.string('comment')
      table.string('creator')
      table.integer('ideas_id').unsigned().references('TEST_ideas.id')
    })
}

exports.down = async function (knex, Promise) {
  return await knex.schema.dropTable('TEST_comments')
}
