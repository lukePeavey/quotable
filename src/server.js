require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const moesifMiddleware = require('./analytics')
const routes = require('./routes')
const { handle404, logErrors, handleErrors } = require('./handleErrors')

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI

// Create the Express server
const app = express()
app.use(cors())
app.use(moesifMiddleware())
app.use(routes)
app.use(handle404)
app.use(logErrors)
app.use(handleErrors)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    /* eslint-disable-next-line no-console */
    app.listen(PORT, () => console.log(`Server is running on port: ' ${PORT}`))
  })
  /* eslint-disable-next-line no-console */
  .catch(error => console.error(error))
