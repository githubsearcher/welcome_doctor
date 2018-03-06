var guests = require('../uploader/guests');
const async = require('async');
const request = require('request');
const fs = require('fs');

var i = 0;

var tasks = guests.map((guest) => {
  return function (cb) {
    if (guest.imageUrl) {
      i++;
      let fileStream = fs.createWriteStream(`uploader/${guest.tagId}.jpg`);

      var r = request(guest.downloadUrl);


      r.on('response', function (res) {
        console.log(i);
        res.pipe(fileStream);
        cb();
      });
    } else {
      cb();
    }
  };
});


async.parallelLimit(tasks, 10,(err) => {
  if (err) {
    return console.log(err);
  }
  console.log('completed');
  console.log(i, guests.length);
});
