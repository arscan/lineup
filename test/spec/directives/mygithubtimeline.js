'use strict';

describe('Directive: myGithubTimeline', function () {

  // load the directive's module
  beforeEach(module('lineupApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-github-timeline></my-github-timeline>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myGithubTimeline directive');
  }));
});
