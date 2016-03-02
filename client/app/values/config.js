var titleFontSize = '12px';

angular.module('angularApp').value('config', {
  height: 200,
  titleFontSize: titleFontSize,
  titleConfig: {
    title: '',
    style: {'fontSize': titleFontSize}
  },
  names: {
    peakVa: 'Gesamtleistung',
    rma: 'RMA',
    ebs: 'EBS'
  }
});
