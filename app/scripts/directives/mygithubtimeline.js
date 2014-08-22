'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myGithubTimeline
 * @description
 * # myGithubTimeline
 */
angular.module('lineupApp')
  .directive('myGithubTimeline', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the myGithubTimeline directive');
      }
    };
  });
