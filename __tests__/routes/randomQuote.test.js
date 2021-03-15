require('dotenv').config()
const request = require('supertest')
const range = require('lodash/range')
const app = require('../../src/app')
const db = require('../../scripts/db')
const Authors = require('../../src/models/Authors')

// Setup
beforeAll(async () => db.connect())
// Teardown
afterAll(async () => db.close())

describe('GET /random', () => {
  it('Response matches schema', async () => {
    const { status, type, body } = await request(app).get('/random')
    expect(status).toBe(200)
    expect(type).toBe('application/json')
    // Response should be a single `Quote` object with the following fields
    expect(body._id).toEqual(expect.any(String))
    expect(body.author).toEqual(expect.any(String))
    expect(body.content).toEqual(expect.any(String))
    expect(body.tags).toEqual(expect.any(Array))
    expect(body.length).toEqual(expect.any(Number))
  })

  it(`When called with tags=love|life|friendship, returns a random quote
  with any one of the specified tags`, async () => {
    const expectedTags = ['love', 'life', 'friendship']
    const query = `tags=${expectedTags.join('|')}`
    const { status, type, body } = await request(app).get(`/random?${query}`)
    expect(status).toBe(200)
    expect(type).toBe('application/json')
    expect(body.tags.some(tag => expectedTags.includes(tag))).toBe(true)
  })

  it(`When called with a valid authorId, returns a random quote by the
  specified author`, async () => {
    const author = await Authors.findOne({})
    const query = `authorId=${author._id}`
    const { status, type, body } = await request(app).get(`/random?${query}`)
    expect(status).toBe(200)
    expect(type).toBe('application/json')
    expect(body.author).toEqual(author.name)
  })

  it(`When called with invalid authorId, responds with 404`, async () => {
    const query = `authorId=does-not-exist`
    const { status, type, body } = await request(app).get(`/random?${query}`)
    expect(status).toBe(404)
    expect(type).toBe('application/json')
  })

  it('Responds with a different quote on each request', async () => {
    // This just fetches two quotes and checks that they are different.
    const responses = await Promise.all(
      range(2).map(() => request(app).get('/random'))
    )
    const [quoteA, quoteB] = responses.map(response => response.body)
    expect(quoteA.content).not.toEqual(quoteB.content)
  })
})
