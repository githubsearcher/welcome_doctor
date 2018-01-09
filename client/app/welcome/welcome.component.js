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
  current2 = true;

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
    let timer = 0;
    this
      .$interval(() => {
        timer--;
        if (timer <= 0) {
          let next = this.queue.shift();
          if (!next) {
            return;
          }
          timer = 5;
          let previous;

          if (this.current2 !== true) {
            previous = this.current2 || this.current1;
            this.addToOldQueue(previous);
          }

          let index = this.indexInOldQueue(next);

          if (index >= 0) {
            this.removeFromOldQueue(next);
          }

          if (this.old.length > 8) {
            this.old.shift();
          }

          this.current1 = this.current1 ? null : next;
          this.current2 = this.current2 ? null : next;
        }
      }, 1000);
  }

  old = [];
  guestsWithProfilePicture = [13140007, 13140903, 13140913, 13141057, 13141207, 5012000038, 5012000598, 5012000732, 5012001130, 5012001210, 5012001283, 5012001322, 5012001377, 5012001405, 5012001457, 5012001669, 5012001772, 5012001854, 5012001909, 5012002013, 5012002079, 5012002120, 5012002351, 5012002492, 5012002529, 5012002588, 5012002650, 5012002698, 5012002786, 5012002793, 5012003015, 5012003035, 5012003038, 5012003052, 5012003114, 5012000651].map( a => a.toString());

  hasProfilePicture(guest){
    return this.guestsWithProfilePicture.indexOf(guest.empNo) >= 0;
 }

  removeFromOldQueue(guestToRemove) {
    const index = this.indexInOldQueue(guestToRemove);

    if (index >= 0) {
      this.old.splice(index, 1);
    }
  }

  addToOldQueue(guestToAdd) {
    if (this.hasProfilePicture(guestToAdd)) {
      this.old.push(guestToAdd);
    }
  }

  indexInOldQueue(targetGuest) {
    return this.old.findIndex((guest) => {
      return guest._id === targetGuest._id;
    });
  }

  getImage(guest) {
    return this.hasProfilePicture(guest) ? `https://res.cloudinary.com/hvyga5upg/image/upload/c_scale,w_400/${guest.empNo}.jpg` : '/assets/images/welcome-logo.png';
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
