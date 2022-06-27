import request from 'supertest'
import app from '../../src/app.js'
import MongoClient from '../../src/MongoClient.js'

const db = new MongoClient()

// Setup
beforeAll(async () => {
  await db.connect()
})

// Teardown
afterAll(async () => {
  await db.disconnect()
})

describe('GET /tags', () => {
  it('Response matches schema', async () => {
    const response = await request(app).get('/tags')
    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
  })
})
