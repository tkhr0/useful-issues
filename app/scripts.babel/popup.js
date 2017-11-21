'use strict';

(function() {
  class Popup {

    constructor() {
      window.addEventListener('load', (evt) => {
        this.start();
      });
    }

    /*
     * popup描画時に実行する
     */
    start() {
      this.assignEventHandlers();
      this.paint();
    }

    /*
     * popupのパーツにbindする
     */
    assignEventHandlers() {
      document.getElementById('fetch').addEventListener('click', (evt) => {
        this.onClickFetchBtn(evt);
      });

      document.getElementById('option').addEventListener('click', (evt) => {
        chrome.tabs.create({'url': "/options.html" } )
      });
    }

    /*
     * メッセージを表示する
     */
    showMessage(text, type) {
      if (!type) {
        type = 'info';
      }

      // メッセージを設定
      var elemMessage = document.getElementById('message');
      elemMessage.innerHTML = text;
      elemMessage.className = type;

      // メッセージを表示＆非表示
      var elemMessagePanel = document.getElementById('message-panel');
      elemMessagePanel.style.display = 'block';
      setTimeout(() => {
        elemMessagePanel.className += ' fadeout';
        setTimeout(() => {
          elemMessagePanel.style.display = 'none';
          elemMessagePanel.className = '';
        }, 500);
      }, 3000);
    }

    /*
     * fetchボタンを押した時の動き
     */
    onClickFetchBtn(evt) {
      chrome.tabs.executeScript(null, {
        file: 'scripts/fetch.js'
      }, (results) => {
        if (results && results.hasOwnProperty(0)) {
          var data = results[0];
          chrome.runtime.getBackgroundPage((backgroundPage) => {
            let bg = backgroundPage.bg;
            bg.saveTemplate(data.title, data.title, data.body);
            this.showMessage('テンプレートとして保存しました');
            this.repaint();
          });
        }else if (results && results.title == '') {
          this.showMessage('タイトルを設定してください', 'error');
        } else {
          this.showMessage('保存に失敗しました', 'error');
        }
      });
    }

    /*
     * titleをクリックした時の動き
     */
    onClickTitleLink(evt) {
      var divTemplate = this;
      var templateId = divTemplate.getAttribute('data-id');

      chrome.tabs.query({  // popupを出しているタブを取得する
        active: true,
        lastFocusedWindow: true
      }, (tabs) => {
        var currentTab = tabs[0];
        chrome.runtime.getBackgroundPage((backgroundPage) => {
          let bg = backgroundPage.bg;
          bg.getTemplateById(templateId, (template) => {
            // テンプレートを適用するスクリプトを実行
            chrome.tabs.executeScript(currentTab.id, {
              file: 'scripts/apply.js'
            }, () => {
              // apply.jsに変数を渡す
              chrome.tabs.sendMessage(currentTab.id, {
                args: {
                  title: template.title,
                  body: template.body
                }
              });
            });
          });
        });
      });
    }

    /*
     * popupを描画する
     */
    paint() {
      var self = this;
      chrome.runtime.getBackgroundPage((backgroundPage) => {
        let bg = backgroundPage.bg;
        bg.getAllTemplates((templates) => {
          var divList = document.getElementById('list');
          var divTemplate;
          Object.keys(templates).forEach(function (key) {
            var template = templates[key];

            divTemplate = document.getElementById('template').cloneNode(true);
            divTemplate.getElementsByClassName('name')[0].innerHTML = template.name;
            divTemplate.id = '';
            divTemplate.setAttribute('data-id', template.id);
            divTemplate.addEventListener('click', function (evt) {
              self.onClickTitleLink.call(this, evt);
            });

            divList.appendChild(divTemplate);
          });

        });
      });
    }

    /*
     * popupを再描画する
     */
    repaint() {
      document.getElementById('list').innerHTML = '';
      this.paint();
    }

    /*
     * テンプレートを適用するbind
     */
    bindApply() {
      Array.prototype.forEach.call(document.getElementsByClassName('name'), (element) => {
        element.addEventListener('click', (evt) => {
          this.onClickTitleLink.call(element, evt);
        });
      });
    }
  }

  new Popup();
})();

