'use strict';

var express = require('express');
var controller = require('./guest.controller');
var multer = require('multer');

var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, process.env.NODE_ENV === 'production' ? 'client/assets/uploads' : 'client/assets/uploads');
  },
  filename(req, file, cb) {
    var dt = file.originalname.split('.');
    var filename = 'import-' + Date.now() + '.' + dt[dt.length - 1];
    return cb(null, filename);
  }
});

var upload = multer({storage});

var router = express.Router();

router.get('/', controller.index);
router.post('/import', upload.single('file'), controller.importGuests);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
