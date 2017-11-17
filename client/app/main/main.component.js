import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {4
  /*@ngInject*/

  constructor($http, $state, $stateParams, FileUploader) {
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.FileUploader = FileUploader;
  }

  $onInit() {
    this.uploader = new this.FileUploader();
    this.uploader.onSuccessItem = (item, response) => {
      this.form.fileName = response.filename;
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

  getGuests(q) {
    return this
      .$http
      .get('/api/guests', {
        params: {
          q: q,
        }
      })
      .then((response) => {
        const guests = response.data.slice(0, 10);
        guests.push({
          name: q,
        });
        return guests;
      })
      .catch((response) => {
        console.log('Error: ', response);
      });
  };

  something(guest) {
    if (guest) {
      if (guest === this.form) {
        return guest.name;
      } else if (guest.email || guest._id) {
        return `${guest.name} ${guest.email || ''}`;
      } else if (guest !== this.form && !guest._id) {
        return 'Add: ' + guest.name;
      } else {
        return '';
      }
    }
  }


  save() {
    if (this.form._id) {
      this
        .$http
        .put(`/api/guests/${this.form._id}`, this.form)
        .then(() => {
          window.location.reload();
        })
        .catch((response) => {
          alert('error while saving.');
          console.log('Re', response);
        });
    } else {
      this
        .$http
        .post('/api/guests', this.form)
        .then(() => {
          window.location.reload();
        })
        .catch((response) => {
          alert('error while saving.');
          console.log('Re', response);
        });
    }
  }
}

export default angular.module('welcomeApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
