const { Router } = require('express')
const random = require('lodash/random')
const data = require('../data/quotes.json')

const router = Router()
const NUMBER_OF_ENTRIES = data.length

/**
 * Get a single random quote
 */
router.get('/random', function(req, res) {
  const index = random(0, NUMBER_OF_ENTRIES - 1)
  const entry = data[index]
  if (!entry) {
    throw new Error('Internal server error')
  }
  res.status(200).json(entry)
})

module.exports = router
