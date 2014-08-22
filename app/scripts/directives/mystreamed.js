'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myStreamed
 * @description
 * # myStreamed
 */
angular.module('lineupApp')
  .directive('myStreamed', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myStreamed directive');
      }
    };
  });
