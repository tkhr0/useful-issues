'use strict'

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)
const expect = chai.expect

import StorageMigration from '../../app/scripts.babel/modules/storage_migration.js'
import MockStorage from '../mock/mock_storage.js'


(function () {

  describe('StorageMigration public methods test', function () {

    it('migrate version none to 1.0.0', function () {
      const now = (new Date).getTime()
      const answer = {
        template: {
          'ORIGINAL': {
            'template_1': {
              id: 'template_1', name: 'name 1',
              title: 'title 1', body: 'body 1', created_at: now
            },
            'template_2': {
              id: 'template_2', name: 'name 2',
              title: 'title 2', body: 'body 2', created_at: now
            },
          }
        },
        storage_version: '1.0.0'
      }

      const storage = new MockStorage()
      const storageMigration = new StorageMigration()
      storageMigration.storage.get = storage.get
      storageMigration.storage.set = storage.set

      storageMigration.storage.set({template: {
        1: {id: 1, name: 'name 1', title: 'title 1', body: 'body 1'},
        2: {id: 2, name: 'name 2', title: 'title 2', body: 'body 2'},
      }})

      const stubCreateTemplateId = sinon.stub()
      stubCreateTemplateId.onCall(0).returns('template_1')
      stubCreateTemplateId.onCall(1).returns('template_2')
      storageMigration.storage._createTemplateId = stubCreateTemplateId

      const stubNow = sinon.stub()
      stubNow.returns(now)
      storageMigration.storage._now = stubNow

      new Promise((resolve) => {
        storageMigration.convert(() => {
          resolve()
        })
      }).then(() => {
        storageMigration.storage.get(null, (data) => {
          expect(data).to.deep.equal(answer)
        })
      })
    })
  })

})()

