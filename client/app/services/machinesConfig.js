/**
 * Created by rainerh on 12.12.15.
 */

angular.module('angularApp').service('machinesConfig', function() {
  return [
    {
      code: 'P-151',
      prettyName: 'Müllzerkleinerer',
      dataSources: 'AVA_ETHERSENS-51',
      sourceMeter: 'ES-51',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-152',
      prettyName: 'Steuerungscont.',
      dataSources: 'AVA_ETHERSENS-52',
      sourceMeter: 'ES-52',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-153',
      prettyName: 'Zerkl. Jupiter',
      dataSources: 'AVA_ETHERSENS-53',
      sourceMeter: 'ES-53',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-154',
      prettyName: 'Bürocontainer',
      dataSources: 'AVA_ETHERSENS-54',
      sourceMeter: 'ES-54',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-155',
      prettyName: 'Vorzerkleinerer',
      dataSources: 'AVA_ETHERSENS-55',
      sourceMeter: 'ES-55',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-156',
      prettyName: 'Zerkleinerer EBS',
      dataSources: 'AVA_ETHERSENS-56',
      sourceMeter: 'ES-56',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-161',
      prettyName: 'Förderband',
      dataSources: 'AVA_ETHERSENS-61',
      sourceMeter: 'ES-61',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-162',
      prettyName: 'Windsichter',
      dataSources: 'AVA_ETHERSENS-62',
      sourceMeter: 'ES-62',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-171',
      prettyName: 'Auftragsband',
      dataSources: 'AVA_ETHERSENS-71',
      sourceMeter: 'ES-71',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }, {
      code: 'P-172',
      prettyName: 'Beschickungsband',
      dataSources: 'AVA_ETHERSENS-72',
      sourceMeter: 'ES-72',
      sourcePoint: 'L1',
      thresholds: [0, 50, 100],
      unit: 'kW'
    }
  ]
});
