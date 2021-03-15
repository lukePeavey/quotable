require('dotenv').config()
const mongoose = require('mongoose')

const { MONGODB_URI } = process.env

/**
 * Connects to the mongodb database
 */
exports.connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      connectTimeoutMS: 1000,
    })
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error('Failed to connect to database')
    process.exit(1)
  }
}
/**
 * Closes the database connection
 */
exports.close = async () => {
  await mongoose.connection.close()
}
