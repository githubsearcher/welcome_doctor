'use strict';

describe('Component: GuestFormComponent', function() {
  // load the controller's module
  beforeEach(module('manualScanningApp.guest-form'));

  var GuestFormComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    GuestFormComponent = $componentController('guest-form', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
