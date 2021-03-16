require('dotenv').config()
const request = require('supertest')
const app = require('../../src/app')
const db = require('../../scripts/db')

beforeAll(async () => db.connect())

afterAll(async () => db.close())

describe('GET /tags', () => {
  it('Response matches schema', async () => {
    const response = await request(app).get('/tags')
    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
  })
})
