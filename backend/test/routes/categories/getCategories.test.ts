import assert from 'assert'
import app from '../../../src/index'
import * as sinon from 'sinon'
import * as chai from 'chai'
import prismaClient from '../../../src/database/prismaClient'
import mockCategories from '../../mock/categories'
import { default as chaiHttp, request } from 'chai-http'

chai.use(chaiHttp)
let agent: ChaiHttp.Agent

describe('getCategories', () => {
  beforeEach(() => {
    agent = request.agent(app)
  })

  afterEach(() => {
    sinon.reset()
    agent.close()
  })

  it('should return data with default values', async () => {
    prismaClient.category.findMany = sinon.stub().resolves(mockCategories)

    const response = await agent.get('/api/v1/categories')
    assert.strictEqual(response.status, 200)
    assert.deepStrictEqual(response.body, {
      categories: mockCategories,
    })
  })

  it('should throw internal server error if unexpected server error happens', async () => {
    prismaClient.category.findMany = sinon.stub().throws(() => {
      return new Error('database error')
    })

    const response = await agent.get('/api/v1/categories')
    assert.strictEqual(response.status, 500)
    assert.deepStrictEqual(response.body, {
      type: 'InternalServerError',
      error: 'Internal server error',
    })
  })
})
