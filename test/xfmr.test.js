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
            let pathGroup = [{
                "path": "/group",
                "method": "get",
                "callbacks": [
                    null
                ],
                "keys": [],
                "regexp": {}
            }, {
                "path": "/group",
                "method": "post",
                "callbacks": [
                    null
                ],
                "keys": [],
                "regexp": {}
            }]

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
        it('should generate a Swagger Responses object from a Sails route with body', () => {
            let route = _.findWhere(sails.router._privateRouter.routes.post, { path: '/contact' })
            let swaggerResponses = xfmr.getResponses(sails, route)

            assert(_.isObject(swaggerResponses['200'].schema))
        })
    })

    describe('#getDefinitions()', () => {
        it('should generate a Swagger Definitions object', () => {
            let swaggerDefinitions = xfmr.getDefinitions(sails);

            assert(_.isObject(swaggerDefinitions))
            assert(_.isObject(swaggerDefinitions.contact))
            assert(_.isObject(swaggerDefinitions.group))
        })
        it('should generate a Swagger Definitions object with nested schemas', () => {
            let swaggerDefinitions = xfmr.getDefinitions(sails);

            assert(_.isObject(swaggerDefinitions.contact))
            assert.deepEqual({ '$ref': '#/definitions/group' }, swaggerDefinitions.contact.properties.group)
        })

        context('populate turned off', () => {
            before(() => {
                sails.config.blueprints.populate = false
            })
            it('should generate a Swagger Definitions object with nested schemas', () => {
                let swaggerDefinitions = xfmr.getDefinitions(sails);

                assert(_.isObject(swaggerDefinitions.contact))
                assert.deepEqual({ type: 'integer', format: 'int32' }, swaggerDefinitions.contact.properties.group)
            })
            after(() => {
                sails.config.blueprints.populate = true
            })
        })
    })

    describe('#getDefinitionReferenceFromPath()', () => {
        it('should generate a Swagger $ref from a simple path /contact', () => {
            assert.equal('#/definitions/contact', xfmr.getDefinitionReferenceFromPath(sails, '/contact'))
        })
        it('should generate a Swagger $ref from a simple path /contact/:id', () => {
            assert.equal('#/definitions/contact', xfmr.getDefinitionReferenceFromPath(sails, '/contact/:id'))
        })
        it('should generate a Swagger $ref from an association path /contact/:parentid/groups', () => {
            assert.equal('#/definitions/group', xfmr.getDefinitionReferenceFromPath(sails, '/contact/:parentid/group'))
        })
        it('should generate a Swagger $ref from an association path /group/:parentid/contacts/:id', () => {
            assert.equal('#/definitions/contact', xfmr.getDefinitionReferenceFromPath(sails, '/group/:parentid/contacts/:id'))
        })
        it('should generate a Swagger $ref from a pluralized association path /users', () => {
            sails.models['user'] = { identity: 'user' }
            assert.equal('#/definitions/user', xfmr.getDefinitionReferenceFromPath(sails, '/users'))
        })
        it('should generate a Swagger $ref from a pluralized association path /memories', () => {
            sails.models['memory'] = { identity: 'memory' }
            assert.equal('#/definitions/memory', xfmr.getDefinitionReferenceFromPath(sails, '/memories'))
        })
    })

    describe('#getDefinitionsFromRouteConfig()', () => {
        before(() => {
            sails.config.routes = _.extend(sails.config.routes, {
                'get /groups/:id': {
                    controller: 'GroupController',
                    action: 'test',
                    skipAssets: 'true',
                    //swagger path object
                    swagger: {
                        summary: ' Get Groups ',
                        description: 'Get Groups Description',
                        produces: [
                            'application/json'
                        ],
                        tags: [
                            'Groups'
                        ],
                        responses: {
                            '200': {
                                description: 'List of Groups',
                                schema: 'Group', //model,
                                type: 'array'
                            }
                        },
                        parameters: [{
                            "name": "id",
                            "in": "path",
                            "description": "ID of pet to use",
                            "required": true,
                            "type": "array",
                            "items": {
                                "type": "string"
                            },
                            "collectionFormat": "csv"
                        }, {
                            "name": "name",
                            "in": "query",
                            "description": "ID of pet to use",
                            "required": true,
                            "type": "string"
                        }, 'Contact']

                    }
                }
            })
        })

        it('#getDefinitionsFromRouteConfig()', () => {
            var results = xfmr.getDefinitionsFromRouteConfig(sails);

            var expectedSwaggerSpec = [{
                "summary": " Get Groups ",
                "description": "Get Groups Description",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Groups"
                ],
                "responses": [{
                    "description": "List of Groups",
                    "schema": "#/definitions/Group",
                    "type": "array"
                }],
                "parameters": [{
                        "name": "id",
                        "in": "path",
                        "description": "ID of pet to use",
                        "required": true,
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "collectionFormat": "csv"
                    }, {
                        "name": "name",
                        "in": "query",
                        "description": "ID of pet to use",
                        "required": true,
                        "type": "string"
                    },
                    "#/definitions/Contact"
                ]
            }];

            assert.equal(true, _.every(results, function(result, index) {
                return _.isEqual(result, expectedSwaggerSpec[index]);
            }));
        })

    })
})
