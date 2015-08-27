import path from 'path'
import _ from 'lodash'
import Sails from 'sails'

const config = {
  appPath: path.dirname(require.resolve('@balderdash/sails-crm')),
  hooks: {
    grunt: false
  },
  log: { level: 'silent' },
  port: 1339
}

before(function (done) {
  this.timeout(30000);

  Sails.lift(config, function(err, server) {
    global.sails = server;
    done(err)
  });
});

after(function () {
  global.sails.lower();
});
