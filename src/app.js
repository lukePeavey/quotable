import express from 'express'
import cors from 'cors'
import routes from './routes'
import { handle404, logErrors, handleErrors } from './handleErrors'

/** The Express app */
const app = express()
app.use(cors())

// Redirect the root URL to the github repository
app.get('/', (req, res) => {
  res.redirect('https://github.com/lukePeavey/quotable')
})

app.use(routes)
app.use(handle404)
app.use(logErrors)
app.use(handleErrors)

export default app
