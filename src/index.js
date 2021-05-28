/* eslint-disable no-console */

import mongoose from 'mongoose'
import app from './app'

async function run() {
  try {
    // Environment variables
    const PORT = process.env.PORT || 4000
    const { MONGODB_URI } = process.env

    // Connect to database, then start the Express server
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    app.listen(PORT, () => {
      console.log(`Quotable is running on port: ${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}
run()
