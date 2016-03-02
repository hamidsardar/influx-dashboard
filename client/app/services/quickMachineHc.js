angular.module('angularApp').service('quickMachineHc', function(quickMachineStatus, formatter) {
  return {
    getConfig: function(machineConfig) {
      return {
        options: {
          chart: {type: 'column', height: 150, margin: 0, backgroundColor: null},
          legend: {enabled: false},
          exporting: false,
          tooltip: {
            enabled: false
          }
        },
        title: {text: '', floating: true},
        xAxis: {type: 'datetime', visible: false},
        yAxis: {
          visible: false,
          min: 0
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

    update: function(dataPromise, machineConfig) {
      dataPromise.then(
        function(data) {
          var highchartsData = data.history;
          var current = data.current.value;
          machineConfig.highchartConfig.series[0].data = highchartsData;
          if (highchartsData.length) {
            var measureDateTime = moment(data.time);
            machineConfig.measureDate = measureDateTime.format('DD.MM.YYYY');
            machineConfig.measureTime = measureDateTime.format('HH:mm:ss');
            machineConfig.value = formatter.value(current);
            machineConfig.color = quickMachineStatus.getColor(machineConfig);
            machineConfig.minorColor = quickMachineStatus.getMinorColor(machineConfig);
          }
          else {
            machineConfig.measureDate = '-';
            machineConfig.measureTime = '-';
            machineConfig.value = '-';
            machineConfig.color = 'white';
            machineConfig.minorColor = 'white';
          }
        }
      );
    }
  }
});
