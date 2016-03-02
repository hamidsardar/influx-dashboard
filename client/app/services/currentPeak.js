/**
 * Created by rainerh on 29.12.15.
 */

var peakVaMaxY = 800;
var peakVaTickAmount = 5;
var peakVaShouldValue = 600;
var peakVaShouldSeconds = 15 * 60;

angular.module('angularApp').service('currentPeak', function(config, formatter, cumulator) {
  return {
    getConfig: function () {
      return {
        options: {
          chart: {height: config.height},
          legend: {enabled: false},
          exporting: false
        },
        title: config.historyConfig,
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: null,
          min: 0,
          max: peakVaMaxY,
          tickAmount: peakVaTickAmount,
          endOnTick: false
        },
        series: [{
          name: config.names.peakVa
        }, {
          name: 'Soll',
          lineWidth: 1,
          color: 'green',
          data: []
        }, {
          name: 'Max',
          dashStyle: 'Dash',
          data: []
        }]
      };
    },
    update: function(data, highchart) {
      data = data.sort(function(a, b) {
        return moment(a.time).unix() - moment(b.time).unix();
      });

      this.data = cumulator.cumulateInfluxData(data);

      this.data = _.map(this.data, function(entry) {
        return [moment(entry.time).toDate().getTime(), formatter.value(entry.value)];
      });
      this.shouldData = this.calcShouldPeak(peakVaShouldValue, peakVaShouldSeconds, new Date(this.data[0][0]));

      highchart.series[0].data = this.data;
      highchart.series[1].data = this.shouldData;
      highchart.series[2].data = this.verticalPeakVa(peakVaShouldValue, peakVaShouldSeconds, new Date(this.data[0][0]));
      highchart.title = {
        text: 'Spitzenlast aktuelle Viertelstunde ' + this.getCurrentDate().format('HH:mm:ss'),
        style: config.titleFontSize
      };
    },
    verticalPeakVa: function verticalPeakVa(staticValue, seconds, startDate) {
      var returner = [];
      var currentDate = moment(startDate);

      for (var i = 0; i < seconds; i++) {
        returner.push([currentDate.toDate().getTime(), staticValue]);
        currentDate.add(1, 'seconds');
      }
      return returner;
    },
    isPeakVaOk: function isPeakVaOk() {
      var currentPeakVa = _.last(this.data);
      var shouldValue = _.find(this.shouldData, function (entry) {
        return entry[0] == currentPeakVa[0];
      });

      return shouldValue[1] >= currentPeakVa[1];
    },
    getCurrentDate: function() {
      return moment(_.last(this.data)[0]).add(1, 'second');
    },
    calcShouldPeak: function calcShouldPeak(shouldValue, seconds, startDate) {
      var returner = [];
      var interval = shouldValue / seconds;
      var currentVal = 0;
      var currentDate = moment(startDate);

      for (var i = 0; i < seconds; i++) {
        returner.push([currentDate.toDate().getTime(), parseFloat(currentVal.toFixed(2))]);
        currentDate.add(1, 'seconds');
        currentVal += interval;
      }
      return returner;
    }
  };
});
