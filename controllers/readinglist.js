const router = require('express').Router()

const { ReadingList } = require('../models')

const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const body = req.body
  await ReadingList.create({
    userId: body.user_id,
    blogId: body.blog_id
  })
  res.status(201).end()
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const entry = await ReadingList.findByPk(req.params.id)
  
  if (entry.userId === req.decodedToken.id) {
    entry.read = req.body.read
    await entry.save()
    res.json(entry)
  } else {
    res.status(401).json({ error: 'user and readinglist entry do not match' })
  }
})

module.exports = router