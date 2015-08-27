const SwaggerController = {
  doc (req, res) {
    let doc = sails.hooks.swagger.doc

    console.log(doc)

    return res.status(200).jsonx(doc)
  }
}

export default SwaggerController
