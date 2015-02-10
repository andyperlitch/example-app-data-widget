'use strict';

angular.module('exampleWidgetApp', [
  'ui.dashboard',
  'com.datatorrent.ui.appdata.widgets.exampleWidget'
])
.controller('ExampleWidgetCtrl', function($scope, exampleWidget) {

  $scope.dashboardOptions = {
    widgetDefinitions: [exampleWidget],
    storage: localStorage,
    storageId: 'example1234'
  };

});