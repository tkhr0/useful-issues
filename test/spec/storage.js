'use strict';

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)
const expect = chai.expect

import Storage from '../../app/scripts.babel/modules/storage.js'


(function () {

  describe('Storage public methods test', function () {
    it('function get original template by id', function () {
      const answer = {title: 'title', body: 'body'}

      const storage = new Storage();

      const stubGetTemplate = sinon.stub()
      storage._getTemplate = stubGetTemplate

      const res = storage.getOriginal('template_id')

      expect(stubGetTemplate).to.has.been.calledWith('ORIGINAL', 'template_id')
    });

    it('function get all templates', function () {
      // const answer = {
      //   'ORIGINAL': {
      //     'template_id1': {title: 'title1', body: 'body1'},
      //     'template_id2': {title: 'title2', body: 'body2'},
      //   }
      // }
      // const storage = new Storage();
      //
      // const res = storage.getAll()
      // expect(res).to.deep.equal(answer)
    })

    it('function save original template', function () {
      const answer = {'template_id': {title: 'title', body: 'body'}}
      const storage = new Storage();

      const getTemplateId = sinon.stub()
      getTemplateId.onCall(0).returns('template_id')
      storage._getTemplateId = getTemplateId

      const spySaveTemplate = sinon.spy(storage, '_saveTemplate')

      const res = storage.saveOriginal('title', 'body')
      expect(spySaveTemplate).to.have.been.calledWith('ORIGINAL', answer)
    })

    it('function delete template by id', function () {
      const storage = new Storage();
    })

  });

  describe('Storage private methods test', function () {
    it('save all template data', function () {
    })

    it('append new template and save overwrite', function () {

    })

    it('get template by type and id', function () {
      const answer = {'template_id': {title: 'title', body: 'body'}}
      const storage = new Storage()

      const stubFetch = sinon.stub()
      stubFetch.callsFake(function(cb) {
        cb({'ORIGINAL': {'template_id': {title: 'title', body: 'body'}}})
      })
      storage._fetch = stubFetch

      const spyMustCall = sinon.spy()

      storage._getTemplate('ORIGINAL', 'template_id', spyMustCall)

      expect(spyMustCall).has.been.calledWith({title: 'title', body: 'body'})
    })

    it('get all templates per type', function () {
      const answer = {
        'template_id_1': {title: 'title_1', body: 'body_1'},
        'template_id_2': {title: 'title_2', body: 'body_2'}
      }
      const storage = new Storage()

      const res = storage._getAllByType('ORIGINAL')
      expect(res).to.deep.equal(answer)
    })

    it('generate template id', function () {
      const storage = new Storage()

      const res = storage._getTemplateId('title + body')
      expect(res).to.be.a('string')
    })
  })
})();
