import path from 'path'
import _ from 'lodash'
import Marlinspike from 'marlinspike'
import xfmr from '../../../lib/xfmr'

class Swagger extends Marlinspike {
  constructor (sails) {
    super(sails, module)
  }

  configure () {
    this.sails.after('lifted', () => {
      this.doc = xfmr.getSwagger(this.sails, this.sails.config.swagger.pkg)
    })
  }
}

export default Marlinspike.createSailsHook(Swagger)
