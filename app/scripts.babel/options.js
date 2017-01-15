'use strict';

(function() {
  class Options {

    constructor() {
      window.addEventListener('load', (evt) => {
        this.start();
      });
    }

    /*
     * 初回読み込み時に動作する
     */
    start() {
      this.paint();
      this.assignEventHandlers();
    }

    /*
     * イベントをバインド
     */
    assignEventHandlers() {
      document.getElementById('delete').addEventListener('click', () => {
        this.onClickDeleteBtn();
      });
    }

    /*
     * 削除ボタンの挙動
     */
    onClickDeleteBtn() {
      var self = this;

      if (!window.confirm('delete this template?')) {
        return;
      }

      var templateId = document.getElementById('preview').getAttribute('data-id');
      chrome.runtime.getBackgroundPage((backgroundPage) => {
        let bg = backgroundPage.bg;
        bg.deleteTemplate(templateId, (isDeleted) => {
          if (isDeleted) {
            self.clear();
            self.paint();
          }
        });
      });
    }

    /*
     * プレビューに表示する
     */
    paintPreview(template) {
      document.getElementById('title').value = template.title;
      document.getElementById('body').value = template.body;
      document.getElementById('preview').setAttribute('data-id', template.id);
    }

    /*
     * 画面を描画する
     */
    paint() {
      self = this;
      // テンプレートのリストを描画する
      chrome.runtime.getBackgroundPage((backgroundPage) => {
        let bg = backgroundPage.bg;
        bg.getAllTemplates((templates) => {
          let elemList = document.querySelector('#list ul');
          let elemTemplate = document.getElementById('template-list');

          // 羅列する
          Object.keys(templates).forEach((key, idx, arr) => {
            var template = templates[key];
            var elemTemplateLink = elemTemplate.content.querySelector('a');

            elemTemplateLink.setAttribute('data-id', template.id);
            elemTemplateLink.innerHTML = template.title;

            var clone = document.importNode(elemTemplate.content, true);
            elemList.appendChild(clone);

            // bind click event
            // templates.contentにイベントのバインドはできないため、
            // appendChildしたElementを再取得してaddEventListenerする
            var elemLink = elemList.lastElementChild.querySelector('a');
            elemLink.addEventListener('click', function (evt) {
              var templateId = this.getAttribute('data-id');
              self.paintPreviewByTemplateId(templateId);
              return false;
            });
          });

        });
      });
    }

    /*
     * リストの選択を反映する
     */
    paintPreviewByTemplateId(templateId) {
      chrome.runtime.getBackgroundPage((backgroundPage) => {
        let bg = backgroundPage.bg;
        bg.getTemplateById(templateId, (template) => {
          this.paintPreview(template);
        });
      });
    }

    /*
     * 描画を初期状態に
     */
    clear() {
      document.querySelector('#list ul').innerHTML = '';
      document.getElementById('preview').setAttribute('data-id', '');
      document.getElementById('title').value = '';
      document.getElementById('body').value = '';
    }

  }

  new Options();
})();

