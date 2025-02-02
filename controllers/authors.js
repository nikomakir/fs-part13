const router = require('express').Router()
const { sequelize } = require('../util/db')
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'blogCount'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes']
    ],
    group: ['author'],
    order: [['totalLikes', 'DESC']]
  })

  res.json(authors)
})

module.exports = router