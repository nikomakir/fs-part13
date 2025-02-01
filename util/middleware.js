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
    return res.status(400).send({ error: 'blog not found' })
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler
}