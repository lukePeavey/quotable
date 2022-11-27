import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import { handle404, logErrors, handleErrors } from './handleErrors.js'
import limiter from './rateLimit.js'
/** The Express app */
const app = express()
app.use(cors())
app.use(limiter)
app.set('trust proxy', 1)
// Redirect the root URL to the github repository
app.get('/', (req, res) => {
  res.redirect('https://github.com/lukePeavey/quotable')
})
app.use(routes)
app.use(handle404)
app.use(logErrors)
app.use(handleErrors)

export default app
