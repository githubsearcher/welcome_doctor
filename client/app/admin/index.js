'use strict';

import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-file-upload';

import routes from './admin.routes';
import AdminController from './admin.controller';
import GuestComponent from './guest/guest.component';
import GuestFormComponent from './guest-form/guest-form.component';

export default angular.module('welcomeApp.admin', ['welcomeApp.auth', 'ui.router',  GuestComponent, GuestFormComponent, uiBootstrap, 'angularFileUpload'])
  .config(routes)
  .controller('AdminController', AdminController)
  .name;
