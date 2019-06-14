// init project
const express = require('express')
const random = require('lodash')
const data = require('../data/quotes.json')
const config = require('./config')

const app = express()

// static files are served from public
app.use(express.static('public'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/', function(req, res) {
  res.redirect('https://github.com/lukepeavey/quota')
})

app.get('/random', function(req, res) {
  let randomQuote = data[random(0, data.length - 1)]
  if (randomQuote) res.json(randomQuote)
})

var listener = app.listen(config.PORT, function() {
  /* eslint-disable-next-line no-console */
  console.log('Your app is listening on port ' + listener.address().port)
})
