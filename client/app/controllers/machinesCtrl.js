/**
 * Created by rainerh on 12.12.15.
 */

angular.module('angularApp').controller('MachinesCtrl',
  function(machinesConfig, quickMachineHc, machineData, $interval) {
    var machines = _.map(machinesConfig, function(machineConfig) {
      machineConfig.highchartConfig = quickMachineHc.getConfig(machineConfig);
      return machineConfig;
    });

    var refreshData = function() {
      _.map(machines, function (machine) {
        quickMachineHc.update(machineData.getCurrent(machine), machine);
      });
    };

    refreshData();
    $interval(refreshData, 30 * 1000);

    return {
      machines: machines,
      columnClass: Math.floor(12 / machinesConfig.length)
    }
  });
