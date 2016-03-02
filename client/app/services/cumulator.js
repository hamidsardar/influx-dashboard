angular.module('angularApp').service('cumulator', function() {
  return {
    cumulateInfluxData: function(entries) {
      var returner = [];
      _.reduce(entries, function(acc, record) {
        var current = {time: record.time, value: (record.value / 1000) + acc.value};
        returner.push(current);
        return current;
      }, {time: null, value: 0});
      return returner;
    }
  }
});
