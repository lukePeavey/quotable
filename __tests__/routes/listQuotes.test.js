require('dotenv').config()
const request = require('supertest')
const app = require('../../src/app')
const db = require('../../scripts/db')

// Setup
beforeAll(async () => db.connect())
// Teardown
afterAll(async () => db.close())

describe('GET /quotes', () => {
  test('Response matches schema', async () => {
    const { status, type, body } = await request(app).get('/quotes')
    expect(status).toBe(200)
    expect(type).toBe('application/json')
    // Response body matches schema
    expect(body.results).toEqual(expect.any(Array))
    expect(body.count).toEqual(body.results.length)
    expect(body.totalCount).toEqual(expect.any(Number))

    // Each result should be an `Quote` object with the following fields
    const quote = body.results[0]
    expect(quote._id).toEqual(expect.any(String))
    expect(quote.author).toEqual(expect.any(String))
    expect(quote.content).toEqual(expect.any(String))
    expect(quote.tags).toEqual(expect.any(Array))
    expect(quote.length).toEqual(expect.any(Number))
  })

  test(`When called with tags=inspirational, returns quotes with the specified
  tag`, async () => {
    const URL = '/quotes?tags=inspirational'
    const { status, type, body } = await request(app).get(URL)

    expect(status).toBe(200)
    expect(type).toBe('application/json')
    expect(body.results[0].tags).toContain('inspirational')
  })

  test(`When called with limit=2, response contains the correct number of
  results`, async () => {
    const URL = '/quotes?limit=2'
    const { status, type, body } = await request(app).get(URL)

    expect(status).toBe(200)
    expect(type).toBe('application/json')
    expect(body.count).toEqual(2)
    expect(body.results.length).toEqual(2)
  })
})
