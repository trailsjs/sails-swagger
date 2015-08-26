import path from 'path'
import _ from 'lodash'
import Sails from 'sails'

const config = {
  appPath: path.dirname(require.resolve('sails-permissions')),
  hooks: {
    grunt: false
  },
  log: { level: 'debug' },
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
