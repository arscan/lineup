'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myProjector
 * @description
 * # myProjector
 */
angular.module('lineupApp')
  .directive('myProjector', function () {
    return {
      template: '<div ng-transclude></div ng-transclude>',
      restrict: 'E',
      transclude: true,
      link: function postLink(scope, element, attrs) {

          var children = $(element).children().children();

          children.css({
              border: '1px solid #fff'
          });


          var $titleDiv = $("<div/>");

          $titleDiv.text(attrs.title);

          $(element).append($titleDiv);

          

      }
    };
  });
