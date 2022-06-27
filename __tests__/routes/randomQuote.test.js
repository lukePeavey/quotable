import request from 'supertest'
import { range, last, first } from 'lodash-es'
import { stringify } from 'query-string'
import app from '../../src/app.js'
import MongoClient from '../../src/MongoClient.js'
import Authors from '../../src/models/Authors.js'
import Quotes from '../../src/models/Quotes.js'

const db = new MongoClient()
// This tag will be used as the value of the `tag` param in tests
let singleTag
// `multipleTags` is a array tags that will be used as the value of the
// `tags` param when testing requests with multiple tags. We know that at least
// one quote will have all of the tags in this array, so we can expect a result
// to be returned when requesting quotes with ALL given tags (ie `?tags=a,b,c`).
let multipleTags
// `singleAuthor` is a random author pulled from the database. this will be
// used when testing the `author` and `authorId` param
let singleAuthor
// The shortest quote in the database. We will use the length of this quote
// when testing the `maxLength` param.
let shortestQuote
// The longest quote in the database. We will use the length of this quote when
// testing the minLength param.
let longestQuote

// Setup
beforeAll(async () => {
  await db.connect()
  // Get a quote with 3 tags
  const quoteWithTags = await Quotes.findOne({ tags: { $size: 3 } })
  const quotesByLength = await Quotes.find({}).sort({ length: 1 })
  shortestQuote = first(quotesByLength)
  longestQuote = last(quotesByLength)
  multipleTags = quoteWithTags.tags
  singleTag = first(multipleTags)
  singleAuthor = await Authors.findOne({})
})
// Teardown
afterAll(async () => {
  await db.disconnect()
})

describe('GET /random', () => {
  test('Response matches schema', async () => {
    const { status, type, body } = await request(app).get('/random')
    // Status should be OK
    expect(status).toBe(200)
    // Response should be JSON
    expect(type).toBe('application/json')
    // Response `body` should match the schema for a single `Quote`...
    expect(body._id).toEqual(expect.any(String))
    expect(body.author).toEqual(expect.any(String))
    expect(body.authorSlug).toEqual(expect.any(String))
    expect(body.content).toEqual(expect.any(String))
    expect(body.tags).toEqual(expect.any(Array))
    expect(body.length).toEqual(body.content.length)
  })

  describe(`With \`tags\` param`, () => {
    test(`Given a valid tag, returns a random quote with the specified
      tag`, async () => {
      const query = { tags: singleTag }
      const url = `/random?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      expect(body.tags).toContain(singleTag)
    })

    test(`Given a pipe-separated list of tags, returns a random quote
      with ANY ONE of the specified tags`, async () => {
      const query = { tags: multipleTags.join('|') }
      const url = `/random?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // Quote should have **at least one** tag in `testTags`
      expect(multipleTags.some(tag => body.tags.includes(tag))).toBe(true)
    })

    test(`Given a comma-separated list of tags, returns a random quote
      with ALL of the specified tags`, async () => {
      const query = { tags: multipleTags.join(',') }
      const url = `/random?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // Quote should have **every** tag in `testTags`
      expect(multipleTags.every(tag => body.tags.includes(tag))).toBe(true)
    })

    test(`If given tag(s) do not match any quotes, responds with a 404`, async () => {
      const query = { tags: 'does-not-exist' }
      const url = `/random?${stringify(query)}`
      const { status, type } = await request(app).get(url)
      expect(status).toBe(404)
      expect(type).toBe('application/json')
    })
  })

  describe('With `author` param', () => {
    test(`Given a valid author \`name\`, returns a random quote by
      the specified author.`, async () => {
      // Select an author from the database.
      const name = encodeURI(singleAuthor.name)
      const url = `/random?${stringify({ author: name })}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      expect(body.author).toEqual(singleAuthor.name)
    })

    test(`Given an author \`name\`, returns a random quote by
      the specified author.`, async () => {
      // Select an author from the database.
      const url = `/random?${stringify({ author: singleAuthor.name })}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      expect(body.author).toEqual(singleAuthor.name)
    })

    test(`Given a valid author \`slug\`, returns a random quote by
      the specified author.`, async () => {
      const validAuthorSlug = singleAuthor.slug
      const query = { author: validAuthorSlug }
      const url = `/random?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      expect(body.author).toEqual(singleAuthor.name)
    })
  })
  describe('with `authorId` param', () => {
    test(`Given a valid authorId, returns a random quote by the
      specified author`, async () => {
      const query = { authorId: singleAuthor._id }
      const url = `/random?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      expect(body.author).toEqual(singleAuthor.name)
    })

    test(`Given an invalid authorId, responds with 404`, async () => {
      const query = { authorId: `does-not-exist` }
      const url = `/random?${stringify(query)}`
      const { status, type } = await request(app).get(url)
      expect(status).toBe(404)
      expect(type).toBe('application/json')
    })
  })

  describe('with `maxLength` param', () => {
    test(`Returns a quote whose length is <= maxLength`, async () => {
      const query = { maxLength: shortestQuote.length }
      const url = `/random?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // Check the value of `Quote.length`
      expect(body.length).toBeLessThanOrEqual(shortestQuote.length)
      // Check the actual length of `Quote.content`
      expect(body.content.length).toBeLessThanOrEqual(shortestQuote.length)
    })
  })
  describe('with `minLength` param', () => {
    test(`Returns a quote whose length is >= minLength `, async () => {
      const query = { minLength: longestQuote.length }
      const url = `/random?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // Check the value of `Quote.length`
      expect(body.length).toBeGreaterThanOrEqual(longestQuote.length)
      // Check the actual length of `Quote.content`
      expect(body.content.length).toBeGreaterThanOrEqual(longestQuote.length)
    })
  })
})
