'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myEncomGlobe
 * @description
 * # myEncomGlobe
 */
angular.module('lineupApp')
  .directive('myEncomGlobe', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myEncomGlobe directive');
      }
    };
  });
