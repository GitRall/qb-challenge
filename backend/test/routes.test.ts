import assert from 'assert'
import app from '../src/index'
import * as sinon from 'sinon'
import * as chai from 'chai'
import prismaClient from '../src/database/prismaClient'
import mockProducts from './mock/products'
import { default as chaiHttp, request } from 'chai-http'

chai.use(chaiHttp)
let agent: ChaiHttp.Agent

describe('Routes', () => {
  describe('healthRoutes -> getHealth', () => {
    beforeEach(() => {
      agent = request.agent(app)
    })

    afterEach(() => {
      sinon.reset()
      agent.close()
    })

    it('should return status ok', async () => {
      prismaClient.$queryRaw = sinon.stub().resolves(2)

      const response = await agent.get('/health')

      assert.strictEqual(response.status, 200)
      assert.deepStrictEqual(response.body, { status: 'ok' })
    })

    it('should return Internal server error if unhealthy', async () => {
      prismaClient.$queryRaw = sinon.stub().throws(() => {
        return new Error('database error')
      })

      const response = await agent.get('/health')
      assert.strictEqual(response.status, 500)
      assert.deepStrictEqual(response.body, {
        type: 'InternalServerError',
        error: 'Internal server error',
      })
    })
  })

  describe('productsRoutes -> getProducts', () => {
    beforeEach(() => {
      agent = request.agent(app)
    })

    afterEach(() => {
      sinon.reset()
      agent.close()
    })

    it('should return data with default values', async () => {
      const total = 20
      const products = mockProducts.slice(0, 10)

      prismaClient.products.count = sinon.stub().resolves(total)
      prismaClient.products.findMany = sinon.stub().resolves(products)

      const response = await agent.get('/products')
      assert.strictEqual(response.status, 200)
      assert.deepStrictEqual(response.body, {
        products,
        pagination: {
          page: 1,
          limit: 10,
          total,
          totalPages: 2,
          hasNextPage: true,
          hasPrevPage: false,
        },
      })
    })

    it('should return data from second page when page is set in query parameters', async () => {
      const total = 20
      const products = mockProducts.slice(10, 20)

      prismaClient.products.count = sinon.stub().resolves(total)
      prismaClient.products.findMany = sinon.stub().resolves(products)

      const response = await agent.get('/products?page=2')
      assert.strictEqual(response.status, 200)
      assert.deepStrictEqual(response.body, {
        products,
        pagination: {
          page: 2,
          limit: 10,
          total,
          totalPages: 2,
          hasNextPage: false,
          hasPrevPage: true,
        },
      })
    })

    it('should return correct amount of products depending on limit', async () => {
      const total = 20
      const products = mockProducts.slice(0, 5)

      prismaClient.products.count = sinon.stub().resolves(total)
      prismaClient.products.findMany = sinon.stub().resolves(products)

      const response = await agent.get('/products?limit=5')
      assert.strictEqual(response.status, 200)
      assert.deepStrictEqual(response.body, {
        products,
        pagination: {
          page: 1,
          limit: 5,
          total,
          totalPages: 4,
          hasNextPage: true,
          hasPrevPage: false,
        },
      })
    })

    it('should throw validation error if string query parameter is not numeric', async () => {
      const response = await agent.get('/products?page=foo&limit=bar')
      assert.strictEqual(response.status, 400)
      assert.deepStrictEqual(response.body, {
        type: 'ValidationError',
        error: [
          {
            origin: 'string',
            code: 'invalid_format',
            format: 'regex',
            pattern: '/^\\d+$/',
            path: ['page'],
            message: 'Invalid string: must match pattern /^\\d+$/',
          },
          {
            origin: 'string',
            code: 'invalid_format',
            format: 'regex',
            pattern: '/^\\d+$/',
            path: ['limit'],
            message: 'Invalid string: must match pattern /^\\d+$/',
          },
        ],
      })
    })

    it('should throw internal server error if unexpected server error happens', async () => {
      prismaClient.products.count = sinon.stub().throws(() => {
        return new Error('database error')
      })

      const response = await agent.get('/products?page=1&limit=10')
      assert.strictEqual(response.status, 500)
      assert.deepStrictEqual(response.body, {
        type: 'InternalServerError',
        error: 'Internal server error',
      })
    })
  })
})
