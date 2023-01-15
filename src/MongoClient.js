/* eslint-disable no-console */
import mongoose from 'mongoose'

const { MONGODB_URI } = process.env

mongoose.set('strictQuery', false)

const defaults = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  connectTimeoutMS: 5000,
}
/**
 * Database client used in the Jests tests.
 */
export default class MongoClient {
  constructor(options) {
    this.connection = null
    this.settings = { ...defaults, ...options }
  }

  async connect() {
    this.connection = await mongoose.connect(MONGODB_URI, this.settings)
  }

  async disconnect() {
    if (this.connection) {
      this.connection.disconnect()
    }
  }
}
