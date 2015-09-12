module.exports.routes = {
  '/swagger/doc': {
    cors: true,
    controller: 'SwaggerController',
    action: 'doc'
  }
}
