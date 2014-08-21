'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myGroupPanel
 * @description
 * # responsible for moving a group of elements around
 */
angular.module('lineupApp')
  .directive('myGroupPanel', function () {
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

          var paper = new Raphael(element[0], 300, 100);

          $titleDiv.text(attrs.title);

          // $titleDiv.text(attrs.title);


          $titleDiv.css({
              color: "#fff",
              'font-family': '"Roboto", sans-serif',
              'text-transform': 'uppercase',
              'font-size': "1.4em",
              'position': 'absolute',
              'top': 0,
              'left': 35
          });

          $(element).css({
              position: "absolute",
              right: 200,
              top: 300,
              width: 500,
              height: 100
          });

          paper
              .path( ['M', 5, 15, 'L', 5, 40, 'L', 250, 40 ] )
              .attr({stroke: "#fff", 'stroke-width':2, 'opacity': 0.4, 'position': 'absolute'})
              .glow({color: "#fff", opacity: 0.2, width: 5});

          paper
              .circle(5,15,3)
              .attr({fill: "#fff", 'stroke-width':0, 'opacity': 0.6, 'position': 'absolute'})
              .glow({color: "#fff", opacity: 0.2, width: 5});

          paper
              .circle(5,40,3)
              .attr({fill: "#fff", 'stroke-width':0, 'opacity': 0.6, 'position': 'absolute'})
              .glow({color: "#fff", opacity: 0.2, width: 5});



          $(element).append($titleDiv);

          

      }
    };
  });
