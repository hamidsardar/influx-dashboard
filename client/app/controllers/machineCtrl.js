/**
 * Created by rainerh on 13.12.15.
 */

angular.module('angularApp').controller('MachineCtrl',
  function(machineConfig, machineHc, machineData, $interval) {
    var current = machineHc.getConfig();
    var daily = machineHc.getConfig();
    var weekly = machineHc.getConfig();

    current.title.text = '15-minutes performance';
    daily.title.text = 'performance by day';
    weekly.title.text = 'performance by week';

    machineHc.updateDaily(machineData.getDaily(machineConfig), daily);
    machineHc.updateWeekly(machineData.getWeekly(machineConfig), weekly);

    var refreshData = function() {
      machineHc.updateCurrent(machineData.getCurrent(machineConfig), current);
    };

    $interval(refreshData, 5 * 60 * 1000);
    refreshData();

    return {
      prettyName: machineConfig.prettyName,
      current: current,
      daily: daily,
      weekly: weekly
    };
  });
