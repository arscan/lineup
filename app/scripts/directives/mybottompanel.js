'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myBottomPanel
 * @description
 * # myBottomPanel
 */


angular.module('lineupApp')
    .directive('myBottomPanel', function () {

    // var svg = '<?xml version="1.0"?><svg height="120" viewPort="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg"> <line x1="20" y1="100" x2="100" y2="20" stroke="black" stroke-width="2"/>';
    var templateString = '<div><div ng-transclude></div></div>';

    function link(scope, elem, attr){
        console.log(scope);
        console.log(elem);
        console.log(attr);

        elem.css({
            'position': 'absolute',
            'bottom': 0,
            'margin': 0,
            'padding': 0,
            'width': '100%',
        });

        console.log(Raphael);
        
        var paper = Raphael(elem[0], "100%", 100);
        paper.path( ['M', 0, 22, 'L', elem.width(), 22 ] ).attr({width: '10px', stroke: '#b6a0b4', 'stroke-width':7, 'opacity': .5}).glow({color: '#b6a0b4', opacity: .2, width: 5});
        paper.path( ['M', 0, 30, 'L', elem.width(), 30 ] ).attr({width: '10px', stroke: '#b6a0b4', 'stroke-width': 3, 'opacity': .5}).glow({color: '#b6a0b4', opacity: .2, width: 5});

        var w = 0;
        while(w < elem.width()){
            w += 80;
            paper.rect(w,11,5,8).attr({'stroke-width': 0, fill: '#b6a0b4', 'opacity': .5}).glow({color: '#b6a0b4', opacity: .2, width: 5});
        }

        w = 0;
        while(w < elem.width()){
            w += 102;
            paper.rect(w,31,8,5).attr({id: 'hiii2', 'stroke-width': 0, fill: '#b6a0b4', 'opacity': .5}).glow({color: '#b6a0b4', opacity: .2, width: 5});
        }

        paper.path( ['M', 0, 42, 'L', elem.width(), 42 ] ).attr({width: '10px', stroke: '#12b7a7', 'stroke-width': 10, 'opacity': .3}).glow({color: '#12b7a7', opacity: .2, width: 5});

        paper.path( ['M', 0, 75, 'L', elem.width(), 75 ] ).attr({width: '10px', stroke: '#12b7a7', 'stroke-width': 6, 'opacity': .3}).glow({color: '#12b7a7', opacity: .2, width: 5});

        w = 500;
        while(w < elem.width()-500){
            w += 60;
            paper.rect(10 + w,65,4,10).attr({id: 'hiii2', 'stroke-width': 0, fill: '#12b7a7', 'opacity': .3}).glow({color: '#12b7a7', opacity: .2, width: 5});
        }

        w = 0;
        while(w < elem.width()){
            w += 95;
            paper.rect(10 + w,78,4,6).attr({id: 'hiii2', 'stroke-width': 0, fill: '#12b7a7', 'opacity': .3}).glow({color: '#12b7a7', opacity: .2, width: 5});
        }

        function drawTrapezoid(x, y, width, height){
            paper.path(['M', x, y+height, 'L', x, y+height-10, 'L', x+ (height-10), y, 'L', x+width, y, 'L', x+width, y+10, 'L', x+width-(height-10), y+height, 'Z']).attr({'fill': '#12b7a7', opacity: .4, "stroke-width": 0});
            
            
            
        };

        drawTrapezoid(160, 30, 800, 40);
        drawTrapezoid(1400, 65, 500, 20);

        // paper.path(['M', 160, 70, 'L', 160, 60, 'L', 190, 30, 'L', 800, 30, 'L', 800, 40, 'L', 770, 70, 'Z']).attr({'fill': '#12b7a7', opacity: .4, "stroke-width": 0});


    }
    return {
        template: templateString,
        restrict: 'E',
        link: link,
        transclude: true
    };
});

