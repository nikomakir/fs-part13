const router = require('express').Router()

const { tokenExtractor, blogFinder } = require('../util/middleware')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.json(blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(401).json({ error: 'User and blog do not match!' })
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes ++
  await req.blog.save()
  res.json({ likes: req.blog.likes })
})

module.exports = router