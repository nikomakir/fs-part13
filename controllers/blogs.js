const router = require('express').Router()
const { Op } = require('sequelize')

const { tokenExtractor, blogFinder, validateUser } = require('../util/middleware')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })

  res.json(blogs)
})

router.post('/', tokenExtractor, validateUser, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.decodedToken.id })
  res.json(blog)
})

router.delete('/:id', tokenExtractor, validateUser, blogFinder, async (req, res) => {
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