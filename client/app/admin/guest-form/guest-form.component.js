'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './guest-form.routes';

export class GuestFormComponent {

  guest = {
    name: '',
    fileName: ''
  };

  /*@ngInject*/
  constructor($http, $state, $stateParams, FileUploader) {
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.FileUploader = FileUploader;
  }

  $onInit() {
    if (this.$stateParams.id) {
      this
        .$http
        .get(`/api/guests/${this.$stateParams.id}`)
        .then((response) => {
          this.guest = response.data;
        })
        .catch((response) => {
          console.log('Re', response);
        });
    }

    this.uploader = new this.FileUploader();
    this.uploader.onSuccessItem = (item, response) => {
      this.guest.fileName = response.filename;
      this.save();
    };
  }

  uploadImage() {
    if (this.uploader.queue && this.uploader.queue.length) {
      this.uploader.uploadAll();
    } else {
      this.save();
    }
  }

  save() {
    if (this.$stateParams.id) {
      this
        .$http
        .put(`/api/guests/${this.$stateParams.id}`, this.guest)
        .then(() => {
          this.$state.go('admin.guest')
        })
        .catch((response) => {
          alert('error while saving.');
          console.log('Re', response);
        });
    } else {
      this
        .$http
        .post('/api/guests', this.guest)
        .then(() => {
          this.$state.go('admin.guest')
        })
        .catch((response) => {
          alert('error while saving.');
          console.log('Re', response);
        });
    }

  }
}

export default angular.module('manualScanningApp.guest-form', [uiRouter])
  .config(routes)
  .component('guestForm', {
    template: require('./guest-form.html'),
    controller: GuestFormComponent,
    controllerAs: 'guestFormCtrl'
  })
  .name;
