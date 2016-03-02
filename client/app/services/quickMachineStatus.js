/**
 * Created by rainerh on 13.12.15.
 */

angular.module('angularApp').service('quickMachineStatus', function() {
  var colorMap = {
    on: {main: '#adf598', minor: '#d3f9ca', title: 'on'},
    idle: {main: '#f1f997', minor: '#f7fbca', title: 'idle'},
    off: {main: '#f29798', minor:'#f7c9cb', title: 'off'},
  };

  return {
    getColor: function(machineConfig, currentVal) {
      return this.getStatus(machineConfig.thresholds, machineConfig.value).main;
    },

    getMinorColor: function(machineConfig, currentVal) {
      return this.getStatus(machineConfig.thresholds, machineConfig.value).minor;
    },

    getName: function(machineConfig, currentVal) {
      return this.getStatus(machineConfig.thresholds, machineConfig.value).title;
    },

    getStatus: function(thresholds, currentVal) {
      if (currentVal >= thresholds[2]) {
        return colorMap['on'];
      }
      else if (currentVal >= thresholds[1]) {
        return colorMap['idle'];
      }
      else {
        return colorMap['off'];
      }
    }
  }
});
