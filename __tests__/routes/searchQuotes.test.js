require('dotenv').config()
const request = require('supertest')
const app = require('../../src/app')
const db = require('../../scripts/db')

beforeAll(async () => db.connect())

afterAll(async () => db.close())

describe('GET /search/quotes', () => {
  it(`Response is OK`, async () => {
    const query = 'a divided house'
    const URL = `/search/quotes?query=${encodeURI(query)}`
    const { status, type, body } = await request(app).get(URL)

    // Response matches schema
    expect(status).toBe(200)
    expect(type).toBe('application/json')
    expect(body).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        totalCount: expect.any(Number),
        results: expect.any(Array),
      })
    )
  })

  // Should either respond with an error or empty results...
  it.todo('When called without a `query`...')

  it.todo('Returns the correct quote(s) when searching by content')

  it.todo('Returns correct quote(s) when searching by author name')
})
