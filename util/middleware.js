const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Blog = require('../models/blog')
const Session = require('../models/session')
const User = require('../models/users')

const unknownEndpoint = (req, res) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.log(error.name)
  console.log(error.message)

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return res.status(400).send({ error: 'blog or user not found' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Username must be unique' })
  }

  next()
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const sessions = await Session.findAll({
        where: {
          userId: req.decodedToken.id
        }
      })
      const isValidToken = sessions.some((s) => s.token === authorization.substring(7))
      if (!isValidToken) {
        throw new Error('token invalid')
      }
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const validateUser = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  blogFinder,
  validateUser
}