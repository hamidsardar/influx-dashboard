var moment = require('moment');

module.exports =  {
  calcRange: function(config) {
    var date = this.getRefDate(config);
    var end = this.rollbackInterval(date, config.divider, config.interval);
    return {
      start: moment(end).subtract(config.divider, config.interval).toDate(),
      end: end
    };
  },

  getRefDate: function(config) {
    var returner = moment();
    if (config.refDate !== '') {
      returner = moment(config.refDate);
    }

    if (config.delay > 0) {
      return returner.subtract(config.delay, config.delayUnit);
    }
    else {
      return returner;
    }
  },

  rollbackInterval: function(date, divider, interval) {
    var returner = this.startAtInterval(date, interval);
    while(!this.isInInterval(returner, divider, interval)) {
      returner.subtract(1, interval);
    }
    return returner.toDate();
  },

  isInInterval: function(date, divider, interval) {
    return date.get(interval) % divider === 0;
  },

  startAtInterval: function(date, interval) {
    return moment(date).startOf(interval);
  }
};

