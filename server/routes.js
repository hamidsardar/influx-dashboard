/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var influx = require('./api/influx');

module.exports = function(app) {
  var influx = require('./api/influx');
  // Insert routes below
  app.route('/api/influx/current/:start/:end').get(influx.module.current);
  app.route('/api/influx/history').get(influx.module.history);
  app.route('/api/influx/machine/current/:name/:start/:end').get(influx.module.machine.current);
  app.route('/api/influx/machine/daily/:name/:start/:end').get(influx.module.machine.daily);
  app.route('/api/influx/machine/weekly/:name/:start/:end').get(influx.module.machine.weekly);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
