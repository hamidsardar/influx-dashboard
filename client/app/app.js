'use strict';

angular.module('angularApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'highcharts-ng'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    window.Highcharts.setOptions({
      global: {useUTC: false},
      lang: {noData: 'Keine Daten vorhanden'}
    });

    $urlRouterProvider
      .otherwise('/');

    $stateProvider.state('main', {
        url: '/',
        templateUrl: 'app/partials/main.html',
        controller: 'MainCtrl'
      });

    $stateProvider.state('machines', {
      url: '/machines/list',
      templateUrl :'app/partials/machines.html',
      controller: 'MachinesCtrl as ctrl'
    });

    $stateProvider.state('machine', {
      url: '/machines/:name',
      templateUrl: 'app/partials/machine.html',
      controller: 'MachineCtrl as ctrl',
      resolve: {
        machineConfig: function(machinesConfig, $stateParams) {
          return _.find(machinesConfig, function(mc) {
            return mc.code == $stateParams.name;
          })
        }
      }
    });

    $locationProvider.html5Mode(true);
  });
