const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Blog = require('../models/blog')

const unknownEndpoint = (req, res) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.log(error.name)
  console.log(error.message)

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return res.status(400).send({ error: 'blog or user not found' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Username must be unique' })
  }

  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
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
  blogFinder
}