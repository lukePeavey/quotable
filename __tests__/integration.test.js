require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const range = require('lodash/range')
const app = require('../src/app')
const Quotes = require('../src/models/Quotes')
const { MONGODB_URI } = process.env

beforeAll(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
  } catch (error) {
    process.exit(1)
  }
})

afterAll(() => {
  // close the mongo connection after tests
  mongoose.connection.close()
})

describe('GET /random', () => {
  it('Request completed successfully', async () => {
    const response = await request(app).get('/random')
    expect(response.status).toBe(200)
  })

  it('Responds with a JSON object containing a single quote when tags param is "love|life".', async () => {
    const response = await request(app).get('/random?tags=love|life')

    expect(response.type).toBe('application/json')
    expect(response.body).toEqual({
      _id: expect.any(String),
      author: expect.any(String),
      content: expect.any(String),
      length: expect.any(Number),
      tags: expect.any(Array),
    })
    expect(
      response.body.tags.find(tag => tag === 'love' || tag === 'life')
    ).not.toBeUndefined()
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

describe('GET /quotes', () => {
  it('without params should respond successfully', async () => {
    const response = await request(app).get('/quotes')

    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
    expect(response.body).toEqual({
      count: expect.any(Number),
      totalCount: expect.any(Number),
      lastItemIndex: expect.any(Number),
      results: expect.any(Array),
    })
    expect(response.body.results[0]).toEqual({
      _id: expect.any(String),
      author: expect.any(String),
      content: expect.any(String),
      tags: expect.any(Array),
      length: expect.any(Number),
    })
  })

  it('with params of "limit=2&skip=1&tags=life,love" should respond successfully', async () => {
    const response = await request(app).get(
      '/quotes?limit=2&skip=1&tags=life,love'
    )
    const { status, type, body } = response

    expect(status).toBe(200)
    expect(type).toBe('application/json')
    expect(body).toEqual({
      count: expect.any(Number),
      totalCount: expect.any(Number),
      lastItemIndex: expect.any(Number),
      results: expect.any(Array),
    })
    expect(body.results[0]).toEqual({
      _id: expect.any(String),
      author: expect.any(String),
      content: expect.any(String),
      tags: expect.any(Array),
      length: expect.any(Number),
    })
    expect(body.results[0].tags).toContain('love')
    expect(body.results[0].tags).toContain('life')
  })
})

describe('GET /authors', () => {
  it('Request completed successfully', async () => {
    const response = await request(app).get('/authors')
    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
  })
})

describe('GET /quotes/:id', () => {
  it('Request completed successfully', async () => {
    const quote = await Quotes.findOne()
    const response = await request(app).get(`/quotes/${quote._id}`)
    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
    expect(response.body).toEqual({
      _id: quote._id,
      author: quote.author,
      content: quote.content,
      tags: expect.any(Array),
      length: expect.any(Number)
    })
  })

  it('Responds with error', async () => {
    const response = await request(app).get('/quotes/fakeId')
    expect(response.status).toBe(404)
    expect(response.type).toBe('application/json')
  })
})

describe('GET /tags', () => {
  it('Request completed successfully', async () => {
    const response = await request(app).get('/tags')
    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
  })
})
