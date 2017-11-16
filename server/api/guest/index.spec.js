'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var guestCtrlStub = {
  index: 'guestCtrl.index',
  show: 'guestCtrl.show',
  create: 'guestCtrl.create',
  upsert: 'guestCtrl.upsert',
  patch: 'guestCtrl.patch',
  destroy: 'guestCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var guestIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './guest.controller': guestCtrlStub
});

describe('Guest API Router:', function() {
  it('should return an express router instance', function() {
    expect(guestIndex).to.equal(routerStub);
  });

  describe('GET /api/guests', function() {
    it('should route to guest.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'guestCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/guests/:id', function() {
    it('should route to guest.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'guestCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/guests', function() {
    it('should route to guest.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'guestCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/guests/:id', function() {
    it('should route to guest.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'guestCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/guests/:id', function() {
    it('should route to guest.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'guestCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/guests/:id', function() {
    it('should route to guest.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'guestCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
