'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './guest.routes';

export class GuestComponent {
  /*@ngInject*/
  constructor($http, $timeout, socket, FileUploader) {
    this.$http = $http;
    this.socket = socket;
    this.$timeout = $timeout;
    this.FileUploader = FileUploader;

  }

  $onInit() {
    this
      .$http
      .get('/api/guests')
      .then((response) => {
        this.loaded = true;
        this.guests = response.data;
      })
      .catch((response) => {
        console.log('Error:', response);
      });
    this.uploader = new this.FileUploader();
    this.uploader.onSuccessItem = (item, response) => {
      alert('Imported Successfully!');
      window.location.reload();
    };


    this.uploader.onErrorItem = (item, response) => {
      alert(`${response.name}: ${response.message}`)
    };
  }

  remove(guest, index) {
    var con = confirm('Are you sure about what you are doing?');
    if (con) {
      this
        .$http
        .delete(`/api/guests/${guest._id}`)
        .then(() => {
          this.guests.splice(index, 1);
        })
        .catch((response) => {
          console.log(response.data);
        });
    }
  }

  uploadCSV() {
    if (this.uploader.queue && this.uploader.queue.length) {
      this.uploader.uploadAll();
    } else {
      this.save();
    }
  }

  reset() {
    this
      .$http
      .get('/api/guests/reset')
      .then(() => {
        alert('Done!');
      })
      .catch(() => {

      });
  }

}

export default angular.module('manualScanningApp.guest', [uiRouter])
  .config(routes)
  .component('guest', {
    template: require('./guest.html'),
    controller: GuestComponent,
    controllerAs: 'guestCtrl'
  })
  .name;
