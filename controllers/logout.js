const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')
const Session = require('../models/session')

router.delete('/', tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      userId: req.decodedToken.id
    }
  })

  res.status(204).end()
})

module.exports = router