import request from 'supertest'
import { stringify } from 'query-string'
import app from '../../src/app.js'
import MongoClient from '../../src/MongoClient.js'
import Authors from '../../src/models/Authors.js'

const db = new MongoClient()
let authorCount
let sortedAuthors
const getId = obj => obj._id

// Setup
beforeAll(async () => {
  await db.connect()
  sortedAuthors = await Authors.find({}).sort({ name: 1 })
  authorCount = await Authors.countDocuments({})
})
// Teardown
afterAll(async () => {
  await db.disconnect()
})

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

  test(`Returns the first page of results`, async () => {
    const { body } = await request(app).get(`/authors`)
    expect(body.page).toEqual(1)
    const expectedAuthorIds = sortedAuthors.slice(0, 20).map(getId)
    expect(body.results.map(getId)).toEqual(expectedAuthorIds)
  })

  test(`Returns second page of results`, async () => {
    const query = stringify({ page: 2 })
    const { body } = await request(app).get(`/authors?${query}`)
    expect(body.page).toEqual(2)
    const expectedAuthorIds = sortedAuthors.slice(20, 40).map(getId)
    expect(body.results.map(getId)).toEqual(expectedAuthorIds)
  })

  test(`When limit is set to 10, returns 10 results per page`, async () => {
    const query = stringify({ page: 1, limit: 10 })
    const { body } = await request(app).get(`/authors?${query}`)
    expect(body.page).toEqual(1)
    expect(body.totalCount).toEqual(authorCount)
    expect(body.count).toEqual(10)
    expect(body.totalPages).toEqual(Math.ceil(authorCount / 10))
  })
})
