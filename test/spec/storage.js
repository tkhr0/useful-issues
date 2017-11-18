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
      const saved = {
        'ORIGINAL': {
          'template_id_1': {title: 'title_1', body: 'body_1'},
        },
        'REPOSITORY': {
          'template_id_2': {title: 'title_2', body: 'body_2'},
        }
      }
      const answer = {
        'template_id_1': {title: 'title_1', body: 'body_1'},
        'template_id_2': {title: 'title_2', body: 'body_2'},
      }

      const storage = new Storage();

      const stubFetch = sinon.stub()
      stubFetch.callsFake(function(cb) {
        cb(saved)
      })
      storage._fetch = stubFetch

      const spyMustCall = sinon.spy()
      
      storage.getAll(spyMustCall)
      expect(spyMustCall).has.been.calledWith(answer)
    })

    it('function save original template', function () {
      const answer = {id: null, name: 'name', title: 'title', body: 'body', created_at: null}

      const storage = new Storage();

      const stubSaveTemplate = sinon.stub()
      storage._saveTemplate = stubSaveTemplate

      const res = storage.saveOriginal('name', 'title', 'body')
      expect(stubSaveTemplate).to.have.been.calledWith('ORIGINAL', answer)
    })

    it('function delete template by id', function () {
      const saved = {
        'ORIGINAL': {'template_id':  {id: 'template_id', title: 'title'}}
      }
      const answer = {
        'ORIGINAL': {}
      }

      const storage = new Storage();


      const stubFetch = sinon.stub()
      stubFetch.callsFake(function(cb) { cb(saved) })
      storage._fetch = stubFetch

      const stubSave = sinon.stub()
      stubSave.callsFake(function (_, cb) { cb() })
      storage._save = stubSave

      const spyMustCall = sinon.spy()

      storage.deleteOriginal('template_id', spyMustCall)

      expect(spyMustCall).to.have.been.calledWith(true)
      expect(stubSave).to.have.been.calledWith(answer)
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

    it('generate template id', function () {
      const storage = new Storage()

      const res = storage._createTemplateId('title + body')
      expect(res).to.be.a('string')
    })

    it('save new template which already have type', function () {
      const now = (new Date).getTime()
      const saved = {
        'ORIGINAL': {'template_id':  {id: 'template_id', title: 'title'}}
      }
      const target = {id: 'new_template', title: 'title'}
      const answer = {
        'ORIGINAL': {
          'template_id':  {id: 'template_id', title: 'title'},
          'new_template': {id: 'new_template', title: 'title', created_at: now}
        }
      }

      const storage = new Storage()

      const stubFetch = sinon.stub()
      stubFetch.callsFake(function(cb) { cb(saved) })
      storage._fetch = stubFetch

      const stubCreateTemplateId = sinon.stub()
      stubCreateTemplateId.onCall(0).returns('new_template')
      storage._createTemplateId = stubCreateTemplateId

      const stubSave = sinon.stub()
      storage._save = stubSave

      const stubNow = sinon.stub()
      stubNow.onCall(0).returns(now)
      storage._now = stubNow

      storage._saveTemplate('ORIGINAL', target)

      expect(stubSave).to.have.been.calledWith(answer)
    })
  })
})();
