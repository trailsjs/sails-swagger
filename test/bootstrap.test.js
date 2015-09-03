import path from 'path'
import _ from 'lodash'
import Sails from 'sails'

const config = {
  appPath: path.resolve(__dirname, '..'),
  hooks: { grunt: false },
  log: { level: 'silent' },
  models: { migrate: 'drop' },
  port: 1339,
  swagger: {
    pkg: require('../package')
  }
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
