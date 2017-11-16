'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newGuest;

describe('Guest API:', function() {
  describe('GET /api/guests', function() {
    var guests;

    beforeEach(function(done) {
      request(app)
        .get('/api/guests')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          guests = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(guests).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/guests', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/guests')
        .send({
          name: 'New Guest',
          info: 'This is the brand new guest!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newGuest = res.body;
          done();
        });
    });

    it('should respond with the newly created guest', function() {
      expect(newGuest.name).to.equal('New Guest');
      expect(newGuest.info).to.equal('This is the brand new guest!!!');
    });
  });

  describe('GET /api/guests/:id', function() {
    var guest;

    beforeEach(function(done) {
      request(app)
        .get(`/api/guests/${newGuest._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          guest = res.body;
          done();
        });
    });

    afterEach(function() {
      guest = {};
    });

    it('should respond with the requested guest', function() {
      expect(guest.name).to.equal('New Guest');
      expect(guest.info).to.equal('This is the brand new guest!!!');
    });
  });

  describe('PUT /api/guests/:id', function() {
    var updatedGuest;

    beforeEach(function(done) {
      request(app)
        .put(`/api/guests/${newGuest._id}`)
        .send({
          name: 'Updated Guest',
          info: 'This is the updated guest!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedGuest = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGuest = {};
    });

    it('should respond with the updated guest', function() {
      expect(updatedGuest.name).to.equal('Updated Guest');
      expect(updatedGuest.info).to.equal('This is the updated guest!!!');
    });

    it('should respond with the updated guest on a subsequent GET', function(done) {
      request(app)
        .get(`/api/guests/${newGuest._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let guest = res.body;

          expect(guest.name).to.equal('Updated Guest');
          expect(guest.info).to.equal('This is the updated guest!!!');

          done();
        });
    });
  });

  describe('PATCH /api/guests/:id', function() {
    var patchedGuest;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/guests/${newGuest._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Guest' },
          { op: 'replace', path: '/info', value: 'This is the patched guest!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedGuest = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedGuest = {};
    });

    it('should respond with the patched guest', function() {
      expect(patchedGuest.name).to.equal('Patched Guest');
      expect(patchedGuest.info).to.equal('This is the patched guest!!!');
    });
  });

  describe('DELETE /api/guests/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/guests/${newGuest._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when guest does not exist', function(done) {
      request(app)
        .delete(`/api/guests/${newGuest._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
