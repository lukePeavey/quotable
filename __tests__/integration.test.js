require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const range = require('lodash/range')
const app = require('../src/app')
const Quotes = require('../src/models/Quotes')
const { MONGODB_URI } = process.env

beforeAll(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
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

  it('Responds with a JSON object containing a single quote.', async () => {
    const response = await request(app).get('/random')
    expect(response.type).toBe('application/json')
    expect(response.body).toEqual({
      _id: expect.any(String),
      author: expect.any(String),
      content: expect.any(String),
    })
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
  it('Request completed successfully', async () => {
    const response = await request(app).get('/quotes')
    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
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
    })
  })

  it('Responds with error', async () => {
    const response = await request(app).get('/quotes/fakeId')
    expect(response.status).toBe(404)
    expect(response.type).toBe('application/json')
  })
})
