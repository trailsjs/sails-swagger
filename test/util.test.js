import assert from 'assert'
import _ from 'lodash'

describe('util', () => {

  let util = require('../util')
  let pkg = require('../package')

  it('should correctly transform package.json', () => {
    let info = util.getInfo(pkg)

    assert(_.isObject(info))
    assert.equal(info.title, 'sails-swagger')
    assert(_.isObject(info.contact))
    assert(_.isString(info.version))
  })
})
