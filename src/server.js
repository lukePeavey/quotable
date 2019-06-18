const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const { handle404, logErrors, handleErrors } = require('./handleErrors')

const PORT = process.env.PORT || 4000

// Create the Express server
const app = express()
app.use(cors())
app.use(routes)
app.use(handle404)
app.use(logErrors)
app.use(handleErrors)

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server is running on port: ' ${PORT}`)
})
