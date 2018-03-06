var cloudinary = require('cloudinary');
var guests = require('../uploader/guests');
var fs = require('fs');
var async = require('async');

cloudinary.config({
  cloud_name: 'hydzbrdlq',
  api_key: '272995983734369',
  api_secret: '09Yy91UKzRamHybLCBYdPZymYfQ'
});
var i = 0;


var tasks = guests.map((guest) => {
  return function(cb) {
    let path = getImagePath(guest.tagId.trim());
    if(path) {
      cloudinary
        .v2
        .uploader
        .upload(path, (err, result) => {
          if(err) {
            console.log(guest.tagId, err);
            return cb();
          }
          guest.profilePicture = result.public_id;
          printPercentage();
          cb();
        });
    } else {
      printPercentage();
      return cb();
    }
  };
});


async.parallelLimit(tasks, 20, (err) => {
  if(err) {
    return console.log(err);
  }
  console.log('completed');
  console.log(JSON.stringify(guests));
});


function getImagePath(name) {
  if(fs.existsSync(`uploader/${name}.jpg`)) {
    return `uploader/${name}.jpg`;
  } else if(fs.existsSync(`../uploader/${name}.png`)) {
    return `../uploader/${name}.png`;
  }
  return null;
}

function printPercentage() {
  i++;
  console.log((i / guests.length * 100).toFixed(2), '% completed');
}
