import hoek from 'hoek'
import _ from 'lodash'

const Transformer = {

  getSwagger (sails, pkg) {
    return {
      swagger: '2.0',
      info: Transformer.getInfo(pkg),
      schemes: [
        'http',
        'https'
      ],
      definitions: Transformer.getDefinitions(sails),
      paths: Transformer.getPaths(sails)
    }
  },

  /**
   * Convert a package.json file into a Swagger Info Object
   * http://swagger.io/specification/#infoObject
   */
  getInfo (pkg) {
    return hoek.transform(pkg, {
      'title': 'name',
      'description': 'description',
      'version': 'version',

      'contact.name': 'author',
      'contact.url': 'homepage',

      'license.name': 'license'
    })
  },

  getDefinitions (sails) {
    return _.transform(sails.models, (definitions, model, modelName) => {
      definitions[model.globalId] = {
        id: model.identity,
        properties: model.definition
      }
    })
  },

  /**
   * Convert the internal Sails route map into a Swagger Paths
   * Object
   * http://swagger.io/specification/#pathsObject
   * http://swagger.io/specification/#pathItemObject
   */
  getPaths (sails) {
    let routes = sails.router._privateRouter.routes
    let pathGroups = _.chain(routes)
      .values()
      .flatten()
      .unique(route => {
        return route.path + route.method + JSON.stringify(route.keys)
      })
      .groupBy('path')
      .mapKeys((_, path) => {
        return path.replace(/:(\w+)\??/g, '{$1}')
      })
      .value()

    return _.mapValues(pathGroups, (pathGroup, key) => {
      return Transformer.getPathItem(sails, pathGroup, key)
    })
  },

  getModelFromPath (sails, path) {
    let split = path.split('/')
    let [ $, parentModelName, parentId, childAttributeName, childId ] = path.split('/')
    let parentModel = sails.models[parentModelName]
    let childAttribute = _.get(parentModel, [ 'attributes', childAttributeName ])
    let childModelName = _.get(childAttribute, 'collection') || _.get(childAttribute, 'model')
    let childModel = sails.models[childModelName]

    return childModel || parentModel
  },

  /**
   * http://swagger.io/specification/#definitionsObject
   */
  getDefinitionReference (sails, path) {
    let model = Transformer.getModelFromPath(sails, path)
    if (model) {
      return '#/definitions/' + model.identity
    }
  },

  /**
   * http://swagger.io/specification/#pathItemObject
   */
  getPathItem (sails, pathGroup, pathkey) {
    let methodGroups = _.chain(pathGroup)
      .indexBy('method')
      .pick([
        'get', 'post', 'put', 'head', 'options', 'patch', 'delete'
      ])
      .value()

    return _.mapValues(methodGroups, (methodGroup, method) => {
      return Transformer.getOperation(sails, methodGroup, method)
    })
  },

  /**
   * http://swagger.io/specification/#operationObject
   */
  getOperation (sails, methodGroup, method) {
    return {
      summary: `${method}`,
      consumes: [ 'application/json' ],
      produces: [ 'application/json' ],
      parameters: Transformer.getParameters(sails, methodGroup),
      responses: Transformer.getResponses(sails, methodGroup)
    }
  },

  /**
   * http://swagger.io/specification/#parameterObject
   */
  getParameters (sails, methodGroup) {
    let routeParams = methodGroup.keys

    if (!routeParams.length) return

    return _.map(routeParams, param => {
      return {
        name: param.name,
        in: 'path',
        required: true,
        type: 'string'
      }
    })
  },

  /**
   * http://swagger.io/specification/#responsesObject
   */
  getResponses (sails, methodGroup) {
    let $ref = Transformer.getDefinitionReference(sails, methodGroup.path)
    let ok = {
      description: 'The requested resource'
    }
    if ($ref) {
      ok.schema = { '$ref': $ref }
    }
    return {
      '200': ok,
      '404': { description: 'Resource not found' },
      '500': { description: 'Internal server error' }
    }
  }
}

export default Transformer
