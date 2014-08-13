'use strict';

/**
 * @ngdoc directive
 * @name lineupApp.directive:myInfoGroup
 * @description
 * # myInfoGroup
 */




angular.module('lineupApp')
.directive('myInfoGroup', function () {
    var templateString = '<div>waka</div>';
    function link(scope, elem, attr){
        console.log(scope);
        console.log(elem);
        console.log(attr);
    }
    return {
        template: templateString,
        restrict: 'E',
        link: link
    };
});

