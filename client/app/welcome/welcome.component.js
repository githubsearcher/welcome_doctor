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
  idle;
  showImageList = false;
  idleScreenEnabled = true;

  setIdle(status) {
    if (this.idleScreenEnabled) {
      this.idle = status;
    }
  }

  $onInit() {
    const IDLE_TIME = -90;
    const NEXT_PICTURE_TIME = 5;
    this.setIdle(true);

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
            if (timer < IDLE_TIME && this.idle === false) {
              this.idle = true;
            }
            return;
          }
          timer = NEXT_PICTURE_TIME;
          let previous;
          this.idle = false;
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

  removeFromOldQueue(guestToRemove) {
    const index = this.indexInOldQueue(guestToRemove);

    if (index >= 0) {
      this.old.splice(index, 1);
    }
  }

  addToOldQueue(guestToAdd) {
    if (guestToAdd.profilePicture) {
      this.old.push(guestToAdd);
    }
  }

  indexInOldQueue(targetGuest) {
    return this.old.findIndex((guest) => {
      return guest._id === targetGuest._id;
    });
  }

  getImage(guest) {
    return guest.profilePicture ? `https://res.cloudinary.com/hydzbrdlq/image/upload/c_scale,w_400/${guest.profilePicture}.jpg` : '/assets/images/user.png';
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
