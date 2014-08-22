'use strict';

describe('Directive: myEncomGlobe', function () {

  // load the directive's module
  beforeEach(module('lineupApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-encom-globe></my-encom-globe>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myEncomGlobe directive');
  }));
});
