module.exports.routes = {
  '/swagger/doc': {
    cors: {
      origin: 'http://swagger.balderdash.io',
      methods: 'GET,OPTIONS,HEAD'
    },
    controller: 'SwaggerController',
    action: 'doc'
  }
}
