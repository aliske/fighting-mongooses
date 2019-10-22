
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('TEST_ideas').del()
    .then(function () {
      // Inserts seed entries
      return knex('TEST_ideas').insert([
        {creator: 'Ali', idea: 'A To Do List app!'},
        {creator: 'Ali', idea: 'A Blog!'},
        {creator: 'Ali', idea: 'A calculator'}
      ]);
    });
};


