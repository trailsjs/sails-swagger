import hoek from 'hoek'

const Transformer = {

  getSwagger (sails, pkg) {
    return {
      swagger: '2.0',
      info: Transformer.getInfo(pkg),
      schemes: [
        'http',
        'https'
      ],
      paths: Transformer.getPaths(sails.router._privateRouter.routes)
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

  /**
   * Convert the internal Sails route map into a Swagger Paths
   * Object
   * http://swagger.io/specification/#pathsObject
   * http://swagger.io/specification/#pathItemObject
   */
  getPaths (routes) {
    let pathGroups = _.chain(routes)
      .values()
      .flatten()
      .groupBy('path')
      .value()

    return _.mapValues(pathGroups, Transformer.getPathItem)
  },

  getPathItem (pathGroup, key) {
    let methodGroups = _.chain(pathGroup)
      .groupBy('method')
      .pick([
        'get', 'post', 'put', 'head', 'options', 'patch', 'delete'
      ])
      .mapValues(_.flatten)
      .value()

    return _.mapValues(methodGroups, Transformer.getOperation)
  },

  /**
   * http://swagger.io/specification/#operationObject
   */
  getOperation (methodGroup, method) {
    return {
      description: 'a route',
      consumes: [
        'application/json'
      ],
      produces: [
        'application/json'
      ],
      parameters: Transformer.getParameters(methodGroup),
      responses: Transformer.getResponses(methodGroup),
    }
  },

  /**
   * http://swagger.io/specification/#parameterObject
   */
  getParameters (methodGroup) {
    let routeParams = _.flatten(_.pluck(methodGroup, 'keys'))
    return _.map(routeParams, param => {
      return {
        name: param.name,
        in: 'path',
        required: !param.optional
      }
    })
  },

  /**
   * http://swagger.io/specification/#responsesObject
   */
  getResponses (methodGroups) {
    return {
      '200': {
        description: 'the result'
      },
      '403': {
        description: 'Not permitted'
      },
      '404': {
        description: 'Not found'
      },
      '500': {
        description: 'Internal server error'
      }
    }
  }
}

export default Transformer
