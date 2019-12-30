/* eslint-disable no-console */

require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

// Environment variables
const PORT = process.env.PORT || 4000
const { MONGODB_URI } = process.env

// Connect to database, then start the Express server
mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Quotable is running on port: ${PORT}`))
  })
  .catch(error => {
    console.error(error)
  })
