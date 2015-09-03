import assert from 'assert'
import _ from 'lodash'
import xfmr from '../lib/xfmr'
import pkg from '../package'

describe('xfmr', () => {
  describe('#getSwagger', () => {
    it('should generate complete and correct Swagger doc', () => {
      let swagger = xfmr.getSwagger(sails, pkg)


      assert(swagger)
    })
  })
  describe('#getInfo', () => {
    it('should correctly transform package.json', () => {
      let info = xfmr.getInfo(pkg)

      assert(_.isObject(info))
      assert.equal(info.title, 'sails-swagger')
      assert(_.isObject(info.contact))
      assert(_.isString(info.version))
    })
  })
  describe('#getPaths', () => {
    it('should be able to access Sails routes', () => {
      assert(_.isObject(sails.router._privateRouter.routes))
    })
    it('should transform routes to paths', () => {
      let paths = xfmr.getPaths(sails)

      assert(paths)
    })
  })

  describe.skip('#getPathItem', () => {
    it('should generate a Swagger Path Item object from a Sails route', () => {
      let route = sails.router._privateRouter.routes.get[0]
      let pathItem = xfmr.getPathItem(route)

      assert(_.isObject(pathItem))
      assert(_.isObject(pathItem.get))
    })
  })

  describe.skip('#getOperation', () => {
    it('should generate a Swagger Operation object from a Sails route', () => {
      let route = sails.router._privateRouter.routes.get[0]
      let swaggerOperation = xfmr.getOperation(route)

      assert(_.isObject(swaggerOperation))
    })
  })
  describe.skip('#getParameters', () => {
    it('should generate an empty array for a Sails route with no keys', () => {
      let route = sails.router._privateRouter.routes.get[0]
      let params = xfmr.getParameters(route)

      assert(_.isArray(params))
      assert(_.isEmpty(params))
    })
    it('should generate a Swagger Parameters object from a Sails route', () => {
      let route = _.findWhere(sails.router._privateRouter.routes.get, { path: '/contact/:id' })
      assert(route)

      let params = xfmr.getParameters(route)
      assert(_.isArray(params))
      assert.equal(params[0].name, 'id')
    })
  })
  describe.skip('#getResponses', () => {
    it('should generate a Swagger Responses object from a Sails route', () => {
      let route = sails.router._privateRouter.routes.get[0]
      let swaggerResponses = xfmr.getResponses(route)

      assert(_.isObject(swaggerResponses))
    })
  })
  describe('#getDefinitionReference()', () => {
    it('should generate a Swagger $ref from a simple path /contact', () => {
      assert.equal('#/definitions/contact', xfmr.getDefinitionReference(sails, '/contact'))
    })
    it('should generate a Swagger $ref from a simple path /contact/:id', () => {
      assert.equal('#/definitions/contact', xfmr.getDefinitionReference(sails, '/contact/:id'))
    })
    it('should generate a Swagger $ref from an association path /contact/:parentid/groups', () => {
      assert.equal('#/definitions/group', xfmr.getDefinitionReference(sails, '/contact/:parentid/group'))
    })
    it('should generate a Swagger $ref from an association path /group/:parentid/contacts/:id', () => {
      assert.equal('#/definitions/contact', xfmr.getDefinitionReference(sails, '/group/:parentid/contacts/:id'))
    })
  })
})
