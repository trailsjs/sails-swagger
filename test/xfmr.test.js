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

  describe('#getPathItem', () => {
    it('should generate a Swagger Path Item object from a Sails route', () => {
      let pathGroup = [
        {
          "path": "/group",
          "method": "get",
          "callbacks": [
            null
          ],
          "keys": [],
          "regexp": {}
        },
        {
          "path": "/group",
          "method": "post",
          "callbacks": [
            null
          ],
          "keys": [],
          "regexp": {}
        }
      ]

      let pathItem = xfmr.getPathItem(sails, pathGroup)

      assert(_.isObject(pathItem))
      assert(_.isObject(pathItem.get))
      assert(_.isObject(pathItem.post))
      assert(_.isUndefined(pathItem.put))
    })
  })

  describe('#getOperation', () => {
    it('should generate a Swagger Operation object from a Sails route', () => {
      let route = sails.router._privateRouter.routes.get[0]
      let swaggerOperation = xfmr.getOperation(sails, route, 'get')

      assert(_.isObject(swaggerOperation))
    })
  })

  describe('#getParameters', () => {
    it('should generate an empty array for a Sails route with no keys', () => {
      let route = sails.router._privateRouter.routes.get[0]
      let params = xfmr.getParameters(sails, route)

      assert(_.isArray(params))
      assert(_.isEmpty(params))
    })
    it('should generate a Swagger Parameters object from a Sails route', () => {
      let route = _.findWhere(sails.router._privateRouter.routes.get, { path: '/contact/:id' })
      let params = xfmr.getParameters(sails, route)

      assert(_.isArray(params))
      assert.equal(params[0].name, 'id')
    })
    it('should generate a Swagger Parameters object from a Sails model for POST endpoints', () => {
      let route = _.findWhere(sails.router._privateRouter.routes.post, { path: '/contact' })
      let params = xfmr.getParameters(sails, route)

      assert(_.isArray(params))
      assert.equal(params.length, 1)
      assert.equal(params[0].name, 'contact');
    })
    it('should generate a Swagger Parameters object from a Sails model for PUT endpoints', () => {
      let route = _.findWhere(sails.router._privateRouter.routes.put, { path: '/contact/:id' })
      let params = xfmr.getParameters(sails, route)

      assert(_.isArray(params))
      assert.equal(params.length, 2)
      assert.equal(params[0].name, 'id')
      assert.equal(params[1].name, 'contact');
    })
    it('should not generate a Swagger Parameters object when there is not a Sails model', () => {
      let route = _.findWhere(sails.router._privateRouter.routes.post, { path: '/swagger/doc' })
      let params = xfmr.getParameters(sails, route)

      assert(_.isArray(params))
      assert(_.isEmpty(params))
    })
  })

  describe('#getResponses', () => {
    it('should generate a Swagger Responses object from a Sails route', () => {
      let route = sails.router._privateRouter.routes.get[0]
      let swaggerResponses = xfmr.getResponses(sails, route)

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
    it('should generate a Swagger $ref from a pluralized association path /users', () => {
      sails.models['user'] = { identity: 'user' }
      assert.equal('#/definitions/user', xfmr.getDefinitionReference(sails, '/users'))
    })
    it('should generate a Swagger $ref from a pluralized association path /memories', () => {
      sails.models['memory'] = { identity: 'memory' }
      assert.equal('#/definitions/memory', xfmr.getDefinitionReference(sails, '/memories'))
    })
  })
})
