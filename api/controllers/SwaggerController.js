const SwaggerController = {
  doc (req, res) {
    return res.status(200).jsonx(sails.hooks.swagger.doc)
  }
}

export default SwaggerController
