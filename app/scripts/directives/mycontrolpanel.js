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
        '<div class="header">Control Panel Placeholder</div>' + 
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
              bottom: '550px',
              left: '175px',
              color: '#fff',
              border: '1px solid #aaa',
              'border-radius': '5px',
              opacity: 0,
              width: '300px',
              'z-index': 2
          });

          $(".header", element).css({
              'border-bottom': '1px solid #aaa'
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
          /*

          $(".button", element).click(function(){
              scope.currentPosition = $(this).data("position");
              scope.$apply();
          });
         */



          element
             .velocity({scale: 0}, {duration: 0})
             .velocity({
                  left: 150,
                  bottom: 600,
                  opacity: 0.8,
                  scale: 1,
              }, {
                  delay: 8000, 
                  duration: 1000,
                  easing: 'easeOutBack'
              })
              .velocity({
                  left: 160,
                  easing: 'easeOutBack'
              }, {
                  duration: 1000,
                  easing: 'easeOutBack'
              });

      }
    };
  });
