'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myControlPanel
 * @description
 * # myControlPanel
 */
angular.module('lineupApp')
  .directive('myControlPanel', function () {
    var template = '<div>' +
        '<div class="button" ng-click="currentPosition = 0" ng-class="{selected: currentPosition == 0}">Projects</div>' + 
        '<div class="button" ng-click="currentPosition = 1" ng-class="{selected: currentPosition == 1}">Bio</div>' + 
        '<div class="button" ng-click="currentPosition = 2" ng-class="{selected: currentPosition == 2}">Travel</div>' + 
        '<div class="button" ng-click="currentPosition = 3" ng-class="{selected: currentPosition == 3}">Online</div>' + 
        '<div class="button" ng-click="currentPosition = 4" ng-class="{selected: currentPosition == 4}">About</div></div>';
    return {
      template: template,
      restrict: 'E',
      scope: {
          currentPosition: '='
      },
      link: function postLink(scope, element, attrs) {
          
          element.css({
              position: 'absolute',
              bottom: '150px',
              right: '175px',
              color: '#fff',
              opacity: 0,
              width: '400px',
              'z-index': 2
          });

          $(".button", element).css({
              width: 50,
              float: 'left',
              height: 20,
              padding: 5,
              margin: 5,
              border: '1px solid #aaa',
              cursor: 'pointer',
              'border-radius': 4
          });

          element
             .velocity({scale: 0}, {duration: 0})
             .velocity({
                  right: 150,
                  opacity: 0.8,
                  scale: 1,
              }, {
                  delay: 2000, 
                  duration: 1000,
                  easing: 'easeOutBack'
              });

      }
    };
  });
