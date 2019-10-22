const Knex = require('knex')
const connection = require('../../../knexfile')['development']
const { Model } = require('objection')

const knexConnection = Knex(connection)

Model.knex(knexConnection)




class User extends Model {
  static get tableName () {
    return 'users'
  }
}







class Idea extends Model {
  static get tableName () {
    return 'ideas'
  }

  static get relationMappings () {
    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'ideas.id',
          to: 'comments.ideas_id'
        }
      }
    }
  }
}

class Comment extends Model {
  static get tableName () {
    return 'comments'
  }

  static get relationMappings () {
    return {
      idea: {
        relation: Model.BelongsToOneRelation,
        modelClass: Idea,
        join: {
          from: 'comments.ideas_id',
          to: 'ideas.id'
        }
      }
    }
  }
}



module.exports = { User, Idea, Comment }
