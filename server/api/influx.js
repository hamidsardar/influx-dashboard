var influx = require('influx'),
  _ = require('lodash'),
  moment = require('moment');

var newClient = function() {
  return influx({
    host: 'influxdb',
    database: 'muellex',
    port: process.env.INFLUXPORT || '80'
  });
};

var mapTime = function(entries) {
  return _.map(entries, function(entry) {
    return new Date(entry.time);
  });
};

var getQuarters = function(times) {
  return _.filter(times, function(time) {
    return time.getMinutes() % 15 === 0 && time.getSeconds() === 1;
  })
};

var getLatestQuarter = function(entries) {
  return _.max(getQuarters(mapTime(entries)));
};

var filterLastQuarter = function(entries) {
  var latestQuarter = getLatestQuarter(entries);
  return _.filter(entries, function(entry) {
    return moment(entry.time).isAfter(moment(latestQuarter));
  });
};

var filterSums = function(entries) {
  var maxTime = moment(_.max(mapTime(entries)));
  return _.filter(entries, function(entry) {
    return moment(entry.time).isSame(maxTime);
  });
};

exports = exports.module = {
  current: function(req, res) {
    newClient().query(
      "select mean(value) as value from kpi where \"name\" = 'PREPEAK_VA' and time >= '" + req.params.start + "' and time < '" + req.params.end + "' group by time(1s)",
      function (err, peakResponse) {
        newClient().query(
          "select sum(value) as value from kpi where metric = 'status' and time >= now() - 18m group by \"name\"",
          function (err, statusResponse) {
            if (peakResponse && peakResponse[0].length && statusResponse && statusResponse[0]) {
              var all = _.filter(peakResponse[0], function (entry) {
                return entry.value !== null;
              });
              res.send({peakVa: filterLastQuarter(all), latestQuarter: getLatestQuarter(all), status: filterSums(statusResponse[0])});
            }
          }
        );
      }
    );
  },
  machine: {
    current: function(req, res) {
      newClient().query(
        "select mean(value) as value from muellex where \"name\" = '" + req.params.name + "' and time >= '" + req.params.start + "' and time < '" + req.params.end + "' group by time(15m)",
        function (err, history) {
          newClient().query(
            "select value from muellex where \"name\" = '" + req.params.name + "' and time > now() - 3m",
            function (err, current) {
              res.send({history: history[0], current: current[0]});
            });
        }
      );
    },
    daily: function(req, res) {
      newClient().query(
        "select mean(value) as value from muellex where \"name\" = '" + req.params.name + "' and time >= '" + req.params.start + "' and time < '" + req.params.end + "' group by time(1d)",
        function(err, statusResponse) {
          res.send(statusResponse[0]);
        });
    },
    weekly: function(req, res) {
      newClient().query(
        "select mean(value) as value from muellex where \"name\" = '" + req.params.name + "' and time >= '" + req.params.start + "' and time < '" + req.params.end + "' group by time(1w)",
        function(err, statusResponse) {
          res.send(statusResponse[0]);
        });
    }
  },
  history: function (req, res) {
    newClient().query(
      "select first(value) as value, last(value) as lastValue from kpi where \"name\"='PEAK_VA' and time >= now() - 2d group by time(15m), \"name\"",
      function (err, peakResponse) {
        if (peakResponse && peakResponse[0].length) {
          newClient().query(
            "select sum(value) as value from kpi where metric = 'status' and time >= now() - 2d group by time(15m), \"name\"",
            function (err, statusResponse) {
              if (statusResponse && statusResponse[0].length) {
                var peakVa = _.map(peakResponse[0], function (entry) {
                  return [entry.time, entry.value];
                });
                var lastPeakVa = _.last(peakResponse[0]);
                var types = _.groupBy(statusResponse[0], function (entry) {
                  if (entry.name.match(/^EMS/)) {
                    return 'EMS';
                  }
                  else {
                    return 'RMA';
                  }
                });
                var ems = _.groupBy(types.EMS, function (entry) {
                  return entry.time;
                });

                var rma = _.groupBy(types.RMA, function (entry) {
                  return entry.time;
                });

                var calc = function (kpi) {
                  return _.map(kpi, function (entries, time) {

                    var value = 0;
                    var total = 0;
                    for (var i = 0; i < entries.length; i++) {
                      var currentValue = entries[i].value;
                      if (currentValue) {
                        total += currentValue;
                        if (entries[i].name.match(/_ON$/) && currentValue) {
                          value = currentValue
                        }
                      }
                    }
                    if (total > 0) {
                      return [time, value / total];
                    }
                    else {
                      return [time, 0];
                    }
                  });
                };

                res.send({peakVa: peakVa, ems: calc(ems), rma: calc(rma), raw: statusResponse[0]});
              }
              else {
                res.send(null);
              }
            }
          );
        }
        else {
          res.send(null);
        }
      });
  }
};
