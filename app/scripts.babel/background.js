'use strict';

import Storage from 'modules/storage.js'
import StorageMigration from 'modules/storage_migration.js'
import axios from 'axios'


class Background {

  constructor() {
    (new StorageMigration()).convert()
    this.storage = new Storage()
  }

  /*
    * テンプレートをIDを指定してストレージから取得する
    */
    getTemplateById(templateId, callback) {
      this.storage.getOriginal(templateId, callback)
    }

  /*
    * テンプレートをストレージから全取得する
    */
    getAllTemplates(callback) {
      this.storage.getAll(callback)
    }

  /*
    * テンプレートを保存する
    */
    saveTemplate(name, title, body) {
      this.storage.saveOriginal(name, title, body)
    }

  /*
    * テンプレートをID指定で削除する
    */
    deleteTemplate(templateId, callback) {
      this.storage.deleteOriginal(templateId, callback)
    }

  /*
    * GithubAPIからfetch
    */
    _fetchGithub(url, cb) {
      var domain ='https://api.github.com';
      if (url.indexOf(domain) != 0) {
        url = domain + url;
      }

      axios.get(url
      ).then((res) => {
        cb(res);
      })
    }

  /*
    * YAMLをパースしてconfigごとにcbを適用する
    */
    parseYaml(data, cb) {
      yaml.safeLoadAll(data, cb);
    }

  /*
    * リポジトリのテンプレートをキャッシュする
    *
    * cb(templates)
    */
    cacheRepositoryTemplate(owner, repo, cb) {
      var url = '/repos/'+owner+'/'+repo +'/contents/.github';

      this._fetchGithub(url, (res) => {

        res.data.forEach((templateFile) => {
          const templateName = templateFile.name

          axios.get(templateFile.download_url)
            .then((content) => {
              content = content.data
              const templates = {
                title: templateName,
                body: content
              };
              this._appendingSave({'repository_template': templates}, () => {
                cb(templates);
              });
            })
        })
      })
    }

  /*
    * cb(templates)
    */
    getRepositoryTemplates(owner, repo, cb) {
      chrome.storage.local.get('repository_template', (templates) => {
        let hasAny = false

        // Does templates has any key ?
        for (let key in templates) {
          hasAny = true
          break
        }
        hasAny = false

        if (hasAny) {
          cb(templates);
        } else {
          this.cacheRepositoryTemplate(owner, repo, (templates) => {
            this.getRepositoryTemplates(owner, repo, cb);
          })
        }
      })
    }

  /*
    * blobの中身をデコードする
    */
    decodeContent(content) {
      return encodeURIComponent(escape(window.atob(content)))
    }

}

(function() {
  window.bg = new Background();
})();
