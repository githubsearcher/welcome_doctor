'use strict';
const angular = require('angular');
const _ = require('lodash');

const uiRouter = require('angular-ui-router');

import routes from './welcome.routes';

export class WelcomeComponent {
  /*@ngInject*/
  constructor($http, $scope, socket, $interval) {
    this.$http = $http;
    this.socket = socket;
    this.$interval = $interval;

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('guest');
    });
  }

  queue = [];

  $onInit() {
    this
      .$http
      .get('/api/guests')
      .then((response) => {
        this.guests = response.data;
        this.socket.syncUpdates('guest', this.guests, (event, newGuest) => {
          if (event === 'updated' && newGuest.lastTap) {
            console.log('pushing', newGuest);
            this.queue.push(newGuest);
          }
        });
      })
      .catch(() => {

      });

    this
      .$interval(() => {
        let next = this.queue.shift();

        if (next) {
          this.current = next;
        }

      }, 5000);
  }

  getGuests() {
    _
      .chain(this.guests || [])
      .filter((guest) => {
        return guest.lastTap;
      })
      .sortBy((guest) => {
        return guest.lastTap;
      })
      .value();
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
