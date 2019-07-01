require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

// Environment variables
const PORT = process.env.PORT || 4000
const { MONGODB_URI } = process.env

// Connect to the database then start the server
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
  /* eslint-disable-next-line no-console */
  app.listen(PORT, () => console.log(`Quotable is running on port: ${PORT}`))
})
