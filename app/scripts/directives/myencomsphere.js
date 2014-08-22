'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myEncomSphere
 * @description
 * # myEncomSphere
 */
angular.module('lineupApp')
  .directive('myEncomSphere', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myEncomSphere directive');
      }
    };
  });
