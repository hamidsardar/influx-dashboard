angular.module('angularApp').service('historyConfig', function(config) {
  return {
    options: {
      chart: {type: 'column', height: config.height},
      legend: {enabled: false},
      exporting: false
    },
    xAxis: {type: 'datetime'},
    yAxis: {
      min: 0,
      max: 100,
      title: {text: ''},
      labels: {
        formatter: function formatter() {
          return this.value + ' %';
        }
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          formatter: function formatter() {
            return this.value + ' %';
          }
        }
      }
    },
    series: [{
      name: 'RMA'
    }]
  }
});

