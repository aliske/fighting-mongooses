const Knex = require('knex')
const connection = require('../../../knexfile')['development']
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)




class User extends Model {
  static get tableName () {
    return 'TEST_users'
  }
}







class Idea extends Model {
  static get tableName () {
    return 'TEST_ideas'
  }

  static get relationMappings () {
    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'TEST_ideas.id',
          to: 'TEST_comments.ideas_id'
        }
      }
    }
  }
}

class Comment extends Model {
  static get tableName () {
    return 'TEST_comments'
  }

  static get relationMappings () {
    return {
      idea: {
        relation: Model.BelongsToOneRelation,
        modelClass: Idea,
        join: {
          from: 'TEST_comments.ideas_id',
          to: 'TEST_ideas.id'
        }
      }
    }
  }
}



module.exports = { User, Idea, Comment }
