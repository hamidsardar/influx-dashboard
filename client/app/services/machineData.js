/**
 * Created by rainerh on 12.12.15.
 */

angular.module('angularApp').service('machineData', function($http, timeService) {
  var filterNulls = function(entries) {
    return _.filter(entries, function(entry) {
      return entry.value > 0.0;
    });
  };

  var influx2Highchart = function(entries) {
    return _.map(entries, function(entry) {
      return [moment(entry.time).toDate().getTime(), 6 * entry.value / 3600];
    });
  };

  var sortHighchart = function(a, b) {
    return a[0] - b[0];
  };

  var toHighchartsData = function(influxData) {
    var returner = influx2Highchart(filterNulls(influxData));
    returner.sort(sortHighchart);
    return returner;
  };

  return {
    getCurrent: function(machineConfig) {
      var duration = timeService.lastQuarters(16);
      return $http.get(
        '/api/influx/machine/current/' + machineConfig.dataSources + '/' + duration.start.format() + '/' + duration.end.format()
      ).then(function (response) {
        return {
          history: toHighchartsData(response.data.history),
          current: _.last(response.data.current)
        };
      });
    },

    getDaily: function(machineConfig) {
      var end = moment().startOf('day');
      var start = moment(end).subtract(16, 'days');
      return $http.get('/api/influx/machine/daily/' + machineConfig.dataSources + '/' + start.format() + '/' + end.format()).then(function (response) {
        return toHighchartsData(response.data);
      });
    },

    getWeekly: function(machineConfig) {
      var end = moment().startOf('week');
      var start = moment(end).subtract(8, 'weeks');
      return $http.get('/api/influx/machine/weekly/' + machineConfig.dataSources + '/' + start.format() + '/' + end.format()).then(function (response) {
        return toHighchartsData(response.data);
      });
    }
  }
});
