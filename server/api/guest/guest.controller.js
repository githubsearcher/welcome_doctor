/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/guests              ->  index
 * POST    /api/guests              ->  create
 * GET     /api/guests/:id          ->  show
 * PUT     /api/guests/:id          ->  upsert
 * PATCH   /api/guests/:id          ->  patch
 * DELETE  /api/guests/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Guest from './guest.model';
const path = require("path");
const Parse = require('csv-parse');
const fs = require('fs');

function parseCSVFile(sourceFilePath, columns, onNewRecord, handleError, done) {
  const source = fs.createReadStream(sourceFilePath);

  const parser = Parse({
    delimiter: ',',
    columns: columns
  });

  parser.on("readable", function () {
    let record;
    while (record = parser.read()) {
      onNewRecord(record);
    }
  });

  parser.on("error", (error) => {
    handleError(error)
  });

  parser.on("end", () => {
    done();
  });

  source.pipe(parser);
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function importGuests(req, res) {
  const filePath = req.file.path;
  if (filePath.indexOf('.csv') < 0) {
    return res
      .status(500)
      .json({
        name: 'UNSUPPORTED_FILE',
        message: 'Please upload .csv file.'
      })
  }
  const rows = [];
  parseCSVFile(filePath, true,
    (record) => {
      rows.push(record);
    },
    (error) => {
      console.log(error);
      res
        .status(500)
        .json({});
    },
    () => {
      console.log('Completed Parsing');
      Guest
        .insertMany(rows)
        .then(function (response) {
          console.log(response);
          res
            .status(200)
            .json(response);
        })
        .catch(function (error) {
          console.log(error);
          res
            .status(500)
            .json(error);
        });
    });
}

// Gets a list of Guests
export function index(req, res) {
  return Guest.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Guest from the DB
export function show(req, res) {
  return Guest.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Guest in the DB
export function create(req, res) {
  return Guest.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Guest in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Guest.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Guest in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Guest.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Guest from the DB
export function destroy(req, res) {
  return Guest.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
