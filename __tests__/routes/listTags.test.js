import request from 'supertest'
import app from '../../src/app'
import db from '../../scripts/db'

beforeAll(async () => db.connect())

afterAll(async () => db.close())

describe('GET /tags', () => {
  it('Response matches schema', async () => {
    const response = await request(app).get('/tags')
    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
  })
})
