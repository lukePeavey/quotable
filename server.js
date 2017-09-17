// init project
var express = require('express')
var { random } = require('lodash')
var data = require('./data/quotes.json')

var app = express()

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

app.get('/', function(request, response) {
  response.redirect('https://github.com/lukepeavey/quota')
})

app.get('/random', function(request, response) {
  let randomQuote = data[random(0, data.length - 1)]
  if (randomQuote) response.json(randomQuote)
})

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})
