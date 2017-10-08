'use strict';

import angular from 'angular';
import {
  UtilService
} from './util.service';

export default angular.module('welcomeApp.util', [])
  .factory('Util', UtilService)
  .name;
