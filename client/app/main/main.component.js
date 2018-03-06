import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  /*@ngInject*/

  constructor($http, $state, $stateParams, Upload) {
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Upload = Upload;
  }

  $onInit() {

  }

  getGuests(q) {
    return this
      .$http
      .get('/api/guests', {
        params: {
          q,
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
  }


  upload(file) {
    file.upload = this
      .Upload
      .upload({
        url: 'https://api.cloudinary.com/v1_1/hydzbrdlq/upload',
        data: {
          upload_preset: 'rx3hdc6e',
          file
        }
      })
      .progress((e) => {
        this.fileUploadSatus = 'Uploading... ' + Math.round((e.loaded * 100.0) / e.total) + '%';
      })
      .success((data, status, headers, config) => {
        this.fileUploadSatus = null;
        this.form.profilePicture = data.public_id;

      })
      .error((data, status, headers, config) => {
        alert('File upload failed.');
      });
  }

  something(guest) {
    if(guest) {
      if(guest === this.form) {
        return guest.name;
      } else if(guest.email || guest._id) {
        return `${guest.name} ${guest.email || ''}`;
      } else if(guest !== this.form && !guest._id) {
        return 'Add: ' + guest.name;
      } else {
        return '';
      }
    }
  }


  save() {
    if(this.form._id) {
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
