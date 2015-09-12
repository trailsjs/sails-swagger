const SwaggerController = {
  doc (req, res) {
    res.status(200).jsonx(sails.hooks.swagger.doc)
  },

  ui (req, res) {
    let docUrl = req.protocol + '://' + req.get('Host') + '/swagger/doc'
    res.redirect(sails.config.swagger.ui.url + '?url=' + encodeURIComponent(docUrl))
  }
}

export default SwaggerController
