import assert from 'assert'
import app from '../../../src/index'
import * as sinon from 'sinon'
import * as chai from 'chai'
import prismaClient from '../../../src/database/prismaClient'
import { default as chaiHttp, request } from 'chai-http'

chai.use(chaiHttp)
let agent: ChaiHttp.Agent

describe('getHealth', () => {
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