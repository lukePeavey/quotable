import request from 'supertest'
import { last, first } from 'lodash-es'
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

describe('GET /quotes', () => {
  test('Response matches schema', async () => {
    const { status, type, body } = await request(app).get('/quotes')
    expect(status).toBe(200)
    expect(type).toBe('application/json')
    // Response body matches schema
    expect(body.results).toEqual(expect.any(Array))
    expect(body.count).toEqual(body.results.length)
    expect(body.totalCount).toEqual(expect.any(Number))
    expect(body.totalPages).toEqual(expect.any(Number))
    expect(body.page).toEqual(expect.any(Number))

    // Each result should be an `Quote` object with the following fields
    const quote = body.results[0]
    expect(quote._id).toEqual(expect.any(String))
    expect(quote.author).toEqual(expect.any(String))
    expect(quote.authorSlug).toEqual(expect.any(String))
    expect(quote.content).toEqual(expect.any(String))
    expect(quote.tags).toEqual(expect.any(Array))
    expect(quote.length).toEqual(quote.content.length)
  })

  describe('With `tags` parameter', () => {
    test(`Returns all quotes matching the given tag`, async () => {
      const expectedResults = await Quotes.find({ tags: { $in: [singleTag] } })
      const query = { tags: singleTag }
      const url = `/quotes?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // The total number of results should match the total number of quotes
      // with the given tag (`singleTag`)
      expect(body.totalCount).toEqual(expectedResults.length)
      body.results.forEach(result => expect(result.tags).toContain(singleTag))
    })

    test(`Given a comma-separated list of tags, returns all quotes that match
      ALL of the specified tags`, async () => {
      const expectedResults = await Quotes.find({
        tags: { $all: multipleTags },
      })
      const query = { tags: multipleTags.join(',') }
      const url = `/quotes?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // `totalCount` should match the the number of quotes with all of the given tags
      expect(body.totalCount).toEqual(expectedResults.length)
      // Each result should have **all** of the given tags
      body.results.forEach(result =>
        expect(result.tags).toEqual(expect.arrayContaining(multipleTags))
      )
    })
  })

  describe('with `author` param', () => {
    test(`Given a valid author \`slug\`, returns all quotes by the given
      author`, async () => {
      const validAuthorSlug = singleAuthor.slug
      const expectedResults = await Quotes.find({ authorSlug: validAuthorSlug })
      const query = { author: validAuthorSlug }
      const url = `/quotes?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // `totalCount` should match number of quotes by the given author
      expect(body.totalCount).toEqual(expectedResults.length)
      // The quotes should all be by the correct author
      body.results.forEach(result => {
        expect(result.author).toEqual(singleAuthor.name)
      })
    })

    test(`Given a valid author \`name\`, returns all quotes by the given
      author`, async () => {
      const validAuthorName = singleAuthor.name
      const expectedResults = await Quotes.find({ author: validAuthorName })
      const query = { author: validAuthorName }
      const url = `/quotes?${stringify(query)}`
      const { status, body } = await request(app).get(url)
      expect(status).toBe(200)
      // `totalCount` should match number of quotes by the given author
      expect(body.totalCount).toEqual(expectedResults.length)
      // The quotes should all be by the correct author
      body.results.forEach(result => {
        expect(result.author).toEqual(singleAuthor.name)
      })
    })
    test.todo(`Given a pipe-separated list of author slugs, returns all
      quotes by the given authors `)

    test.todo(`Given a pipe-separated list of author names, returns all
      quotes by the given authors `)
  })
  describe('with `minLength` param', () => {
    test.todo(`Only returns quotes with a length >= minLength`)
  })
  describe('with `minLength` param', () => {
    test.todo(`Only returns quotes with a length <= maxLength`)
  })
})
