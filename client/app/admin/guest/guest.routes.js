'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('admin.guest', {
      url: '/guest',
      template: '<guest></guest>'
    });
}
