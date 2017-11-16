'use strict';

describe('Component: GuestComponent', function() {
  // load the controller's module
  beforeEach(module('manualScanningApp.guest'));

  var GuestComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    GuestComponent = $componentController('guest', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
