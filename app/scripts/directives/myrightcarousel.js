'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myRightCarousel
 * @description
 * # myRightCarousel
 */
angular.module('lineupApp')
  .directive('myRightCarousel', function () {
    return {
      template: '<div ng-transclude></div>',
      transclude: true,
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          var childElements = $element.children().children();
      }
    };
  });
