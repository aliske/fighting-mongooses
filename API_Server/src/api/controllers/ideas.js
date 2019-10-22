const express = require('express')

const { Idea, Comment } = require('../../db/models/schema')

const router = express.Router()



router.get('/', async (req, res) => {
  const ideas = await Idea.query()
  res.json(ideas)
})




router.get('/', (req, res) => {
  Idea.query().then(ideas => {
    res.json(ideas)
  })
})





router.get('/:id', async (req, res) => {
  // gets one idea, found by id.
  //Also fetches the related comments using the .eager method
  const idea = await Idea.query().findById(req.params.id).eager('comments')
  res.json(idea)
})

router.post('/', async (req, res) => {
  // creates a new idea from the request body
  // only allows the idea and creator fields for safety
  const newIdea = req.body

  const idea = await Idea.query()
                         .allowInsert('[idea, creator]')
                         .insert(newIdea)

  res.send(idea)
})

router.post('/:id/comments', async (req, res) => {
  // creates a new comment that is a child of an idea, again sanitizes fields.
  const idea = await Idea.query().findById(req.params.id)

  await idea.$relatedQuery('comments')
            .allowInsert('[comment, creator]')
            .insert(req.body)

  res.send(idea)
})

router.delete('/:id', async (req, res) => {
  // deletes an idea
  await Idea.query().deleteById(req.params.id)

  res.redirect('/ideas')
})

router.delete('/:id/comments/:commentId', async (req, res) => {
  // deletes a comment
  await Comment.query().deleteById(req.params.commentId)

  res.redirect(`/ideas/${req.params.id}`)
})

module.exports = router
