'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './welcome.routes';

export class WelcomeComponent {
  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('guest');
    });
  }

  $onInit() {
    this
      .$http
      .get('/api/guests')
      .then((response) => {
        this.guests = response.data;
        this.socket.syncUpdates('guest', this.guests);

      })
      .catch(() => {

      });
  }

  getGuests() {
    return (this.guests || []).filter((guest) => {
      return guest.lastTap;
    });
  }

}

export default angular.module('welcomeApp.welcome', [uiRouter])
  .config(routes)
  .component('welcome', {
    template: require('./welcome.html'),
    controller: WelcomeComponent,
    controllerAs: 'welcomeCtrl'
  })
  .name;
