'use strict';

var chai = require('chai');
var expect = chai.expect;

(function () {

  describe('Give it some context', function () {
    describe('maybe a bit more context here', function () {
      it('should run here few assertions', function () {
        expect('everthing').to.be.ok;
      });
    });
  });
})();
