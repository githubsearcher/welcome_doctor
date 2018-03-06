'use strict';

var express = require('express');
var cors = require('cors');
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
router.get('/sync', controller.sync);
router.get('/interval/:max', controller.interval);
router.get('/tap', controller.tap);
router.get('/reset', controller.reset);
router.post('/import', upload.single('file'), controller.importGuests);
router.post('/bulk', controller.bulkImportGuests);
router.get('/emp-no/:empNo', controller.showByEmpNo);
router.get('/tag-id/:tagId', cors(),controller.showByTagId);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
