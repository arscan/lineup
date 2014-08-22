'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myHexasphere
 * @description
 * # myHexasphere
 */
angular.module('lineupApp')
  .directive('myHexasphere', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myHexasphere directive');
      }
    };
  });
