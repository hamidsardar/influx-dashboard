'use strict';

angular.module('angularApp').controller('MainCtrl', function ($scope, $http, $interval, config, historyConfig, statusService, timeService, currentPeak) {
  var Highcharts = window.Highcharts;

  $scope.peakVaHistoryConfig = angular.extend(angular.copy(historyConfig), {
    title: angular.extend({text: config.names.peakVa, style: {fontSize: config.titleFontSize}}, config.historyConfig),
    yAxis: {
      title: { text: 'kW' },
      min: 0,
      max: peakVaMaxY,
      tickAmount: peakVaTickAmount,
      endOnTick: false
    },
    series: [{
      name: config.names.peakVa
    }]
  });
  $scope.rmaHistoryConfig = angular.extend(angular.copy(historyConfig), {
    title: angular.extend({text: config.names.rma, style: {fontSize: config.titleFontSize}}, config.historyConfig),
    series: [{
      name: config.names.rma
    }]
  });
  $scope.emsHistoryConfig = angular.extend(angular.copy(historyConfig), {
    title: angular.extend({text: config.names.ebs, style: {fontSize: config.titleFontSize}}, config.historyConfig),
    series: [{
      name: config.names.ebs
    }]
  });
  $scope.peakVaCurrentConfig = currentPeak.getConfig();

  $scope.rmaCurrentConfig = statusService.getConfig();
  $scope.emsCurrentConfig = statusService.getConfig();
  $scope.emsCurrentConfig.series[0].name = 'EBS';

  var toQuarterEnd = function toQuarterEnd(date) {
    return moment(date).add(15, 'minutes').toDate();
  };

  var higchartsSorter = function higchartsSorter(record1, record2) {
    return record1[0] - record2[0];
  };

  var currentRequest = function currentRequest() {
    var duration = timeService.currentQuarter();
    $http.get(
      '/api/influx/current/' + duration.start.format() + '/' + duration.end.format()
    ).success(function (data) {

      currentPeak.update(data.peakVa, $scope.peakVaCurrentConfig);
      $scope.isPeakVaOk = currentPeak.isPeakVaOk();
      var currentDate = currentPeak.getCurrentDate();

      statusService.update(_.filter(data.status, function(entry) {
        return entry.name.match(/RMA/);
      }), $scope.rmaCurrentConfig, currentDate, 'RMA');

      statusService.update(_.filter(data.status, function(entry) {
        return entry.name.match(/EMS/);
      }), $scope.emsCurrentConfig, currentDate, 'EBS');
    });
  };

  currentRequest();
  $interval(currentRequest, 60 * 1000);

  var historyRequest = function() {
    $http.get('/api/influx/history').success(function (data) {
      var setHistoryData = function setHistoryData(data) {
        return _.map(data, function (entries) {
          return [toQuarterEnd(moment(entries[0]).toDate()).getTime(), parseFloat((entries[1] * 100).toFixed(2))];
        });
      };

      var peakVaHistoryData = _.map(data.peakVa, function (entries) {
        return [moment(entries[0]).toDate().getTime(), parseFloat((entries[1] / 1000).toFixed(2))];
      });
      peakVaHistoryData.sort(higchartsSorter);
      $scope.peakVaHistoryConfig.series[0].data = peakVaHistoryData;

      var rmaHistoryData = setHistoryData(data.rma);
      rmaHistoryData.sort();
      $scope.rmaHistoryConfig.series[0].data = rmaHistoryData;

      var ebsHistoryData = setHistoryData(data.ems);
      ebsHistoryData.sort();
      $scope.emsHistoryConfig.series[0].data = ebsHistoryData;
    });
  };

  historyRequest();
  $interval(historyRequest, 60 * 1000);
});

