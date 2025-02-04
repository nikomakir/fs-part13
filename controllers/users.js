const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read &&
    (req.query.read === 'true' || req.query.read === 'false')) {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    include: [{
      model: Blog,
      attributes: { exclude: ['userId'] }
    }, {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId'] },
      through: {
        attributes: ['id', 'read'],
        where
      }
    }]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  user.username = req.body.username
  await user.save()

  res.json(user)
})

module.exports = router