import request from 'supertest'
import { stringify } from 'query-string'
import app from '../../src/app.js'
import MongoClient from '../../src/MongoClient.js'

const db = new MongoClient()

beforeAll(async () => {
  await db.connect()
})
// Teardown
afterAll(async () => {
  await db.disconnect()
})

describe('GET /search/quotes', () => {
  it(`Response is OK`, async () => {
    const query = { query: 'freedom' }
    const URL = `/search/quotes?query=${stringify(query)}`

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
