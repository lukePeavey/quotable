import mongoose from 'mongoose'

const { MONGODB_URI } = process.env

/**
 * Connects to the mongodb database
 */
export async function connect() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
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
export async function close() {
  await mongoose.connection.close()
}
