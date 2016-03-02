/**
 * Created by rainerh on 14.12.15.
 */

angular.module('angularApp').service('machineHc', function() {
  return {
    getConfig: function() {
      return {
        options: {
          chart: {type: 'column', height: 150, backgroundColor: null},
          legend: {enabled: false},
          exporting: false
        },
        title: {text: ''},
        xAxis: {type: 'datetime'},
        yAxis: {
          title: {text: 'kW'}
        },
        plotOptions: {
          series: [{
            dataLabels: {
              formatter: function formatter() {
                return this.value + ' kW';
              }
            }
          }]
        },
        series: [{color: 'darkblue'}]
      };
    },

    updateCurrent: function(dataPromise, highchart) {
      this.update(dataPromise.then(
        function(data) {
          return data.history;
        }), highchart);
    },

    updateDaily: function(dataPromise, highchart) {
      this.update(dataPromise, highchart);
    },

    updateWeekly: function(dataPromise, highchart) {
      this.update(dataPromise, highchart);
    },

    update: function(dataPromise, highchart) {
      dataPromise.then(function(highchartsData) {
        highchart.series[0].data = highchartsData;
      });
    }
  }
});
