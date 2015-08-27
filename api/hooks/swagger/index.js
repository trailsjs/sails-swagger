import path from 'path'
import _ from 'lodash'
import Marlinspike from 'marlinspike'
import xfmr from '../../../lib/xfmr'

class Swagger extends Marlinspike {
  constructor (sails) {
    super(sails, module)
  }

  initialize (next) {
    let hook = this.sails.hooks.swagger
    this.sails.after('lifted', () => {
      hook.doc = xfmr.getSwagger(this.sails, this.sails.config.swagger.pkg)
    })

    next()
  }
}

export default Marlinspike.createSailsHook(Swagger)
