'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myEncomBoardroom
 * @description
 * # myEncomBoardroom
 */
angular.module('lineupApp')
  .directive('myEncomBoardroom', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myEncomBoardroom directive');
      }
    };
  });
