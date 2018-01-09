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

  guestsWithProfilePicture = [13140007, 13140903, 13140913, 13141057, 13141207, 5012000038, 5012000598, 5012000732, 5012001130, 5012001210, 5012001283, 5012001322, 5012001377, 5012001405, 5012001457, 5012001669, 5012001772, 5012001854, 5012001909, 5012002013, 5012002079, 5012002120, 5012002351, 5012002492, 5012002529, 5012002588, 5012002650, 5012002698, 5012002786, 5012002793, 5012003015, 5012003035, 5012003038, 5012003052, 5012003114, 5012000651].map(a => a.toString());

  hasProfilePicture(guest) {
    return this.guestsWithProfilePicture.indexOf(guest.empNo) >= 0;
  }

  tap(guest) {
    this.$http.get('/api/guests/tap?tagId=' + guest.tagId);
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
