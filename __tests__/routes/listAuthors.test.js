import request from 'supertest'
import app from '../../src/app'
import db from '../../scripts/db'

// Setup
beforeAll(async () => db.connect())
// Teardown
afterAll(async () => db.close())

describe('GET /authors', () => {
  it('Response matches schema', async () => {
    const { status, type, body } = await request(app).get('/authors')
    expect(status).toBe(200)
    expect(type).toBe('application/json')
    // Response matches schema
    expect(body.results).toEqual(expect.any(Array))
    expect(body.count).toEqual(body.results.length)
    expect(body.totalCount).toEqual(expect.any(Number))
    expect(body.totalPages).toEqual(expect.any(Number))
    expect(body.page).toEqual(expect.any(Number))

    // Each result should be an `Author` object with the following fields
    const author = body.results[0]
    expect(author._id).toEqual(expect.any(String))
    expect(author.slug).toEqual(expect.any(String))
    expect(author.name).toEqual(expect.any(String))
    expect(author.bio).toEqual(expect.any(String))
    expect(author.description).toEqual(expect.any(String))
    expect(author.link).toEqual(expect.any(String))
    expect(author.quoteCount).toEqual(expect.any(Number))
  })
})
