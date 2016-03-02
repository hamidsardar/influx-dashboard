angular.module('angularApp').service('formatter', function() {
  return {
    value: function (value) {
      return parseFloat(value.toFixed(2));
    },

    formatLastUpdated: function(kpiName, updateDate, fontSize) {
      return {
        text: kpiName + " - letzte 15 Minuten "  + updateDate.format('HH:mm:ss'),
        style: {fontSize: fontSize}
      };
    }
  }
});
