'use strict';

describe('Directive: myProjector', function () {

  // load the directive's module
  beforeEach(module('lineupApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-projector></my-projector>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myProjector directive');
  }));
});
