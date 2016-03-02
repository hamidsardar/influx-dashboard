/**
 * Created by rainerh on 17.12.15.
 */

angular.module('angularApp').service('statusService', function(config, formatter) {
  return {
    getConfig: function() {
      return {
        title: config.titleConfig,
        options: {
          chart: {
            type: 'pie',
            height: config.height
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          exporting: false,
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0px 1px 2px black'
                }
              },
              size: '275%',
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '130%']
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'RMA',
          colorByPoint: true,
          innerSize: '50%',
          data: []
        }]
      };
    },

    update: function(data, highchart, updateDate, kpiName) {
      var sum = _.sum(data, 'value');
      highchart.series[0].data = _(data)
        .filter(function(entry) {
          return entry.value;
        })
        .map(this.setStatusFromName)
        .map(this.setColor)
        .map(function(entry) {
          entry.y = entry.value / sum;
          return entry;
        })
        .value();

      highchart.title = formatter.formatLastUpdated(kpiName, updateDate, config.titleFontSize);
    },

    setStatusFromName: function(entry) {
      entry.name = _.last(entry.name.split('_'));
      return entry;
    },

    setColor: function(entry) {
      var colors = {
        OFF: '#fa8072',
        IDLE: '#ffd700',
        ON: '#006400'
      };
      entry.color = colors[entry.name];
      return entry;
    }
  }
});
