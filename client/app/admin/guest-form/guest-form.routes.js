'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('admin.guest-create', {
      url: '/guest/create',
      template: '<guest-form></guest-form>'
    })
    .state('admin.guest-edit', {
      url: '/guest/edit/:id',
      template: '<guest-form></guest-form>'
    });
}
