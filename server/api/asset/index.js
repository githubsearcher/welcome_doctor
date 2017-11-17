'use strict';

var express = require('express');
var multer = require('multer');
var controller = require('./asset.controller');

var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.NODE_ENV === 'production' ? 'client/assets/uploads' : 'client/assets/uploads');
  },
  filename(req, file, cb) {
    var dt = file.originalname.split('.');
    var filename = file.fieldname + '-' + Date.now() + '.' + dt[dt.length - 1];
    console.log(dt);
    return cb(null, filename);
  }
});

var upload = multer({storage});

var router = express.Router();

router.post('/', upload.single('file'), controller.index);

module.exports = router;
