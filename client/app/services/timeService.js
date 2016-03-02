/**
 * Created by rainerh on 22.12.15.
 */

angular.module('angularApp').service('timeService', function() {
  return {
    lastQuarters: function(count) {
      var end = moment();
      var startQuarter = parseInt(end.get('minutes') / 15);
      end.set('minute', startQuarter * 15).set('second', 0);
      var start = moment(end).subtract(count * 15, 'minutes');

      return {start: start, end: end};
    },

    currentQuarter: function(delayMinutes) {
      delayMinutes = delayMinutes || 3;
      var now = moment().subtract(delayMinutes, 'minutes');
      var startQuarter = parseInt(now.get('minutes') / 15);
      var start = now.set('minute', startQuarter * 15).set('second', 0);
      var end = moment(start).add(15, 'minutes');
      return {start: start, end: end};
    }
  }
});
