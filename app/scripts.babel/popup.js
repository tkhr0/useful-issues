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
        }

        /*
         * fetchボタンを押した時の動き
         */
        onClickFetchBtn(evt) {
            chrome.tabs.executeScript(null, {
                file: 'scripts/fetch.js'
            }, (results) => {
                if (results) {
                    var datas = results[0];
                    chrome.runtime.getBackgroundPage((backgroundPage) => {
                        let bg = backgroundPage.bg;
                        bg.saveTemplate(datas.title, datas.title, datas.body);
                        this.repaint();
                    });
                }
            });
        }

        /*
         * titleをクリックした時の動き
         */
        onClickTitleLink(evt) {
            var divTemplate = this.parentElement;
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
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg = backgroundPage.bg;
                bg.getAllTemplates((templates) => {
                    var divList = document.getElementById('list');
                    var divTemplate;
                    for (var i=0; i<templates.length; i++){
                        divTemplate = document.getElementById('template').cloneNode(true);

                        divTemplate.getElementsByClassName('name')[0].innerHTML = templates[i].name;
                        divTemplate.id = '';
                        divTemplate.setAttribute('data-id', templates[i].id);

                        divList.appendChild(divTemplate);

                    }
                    this.bindApply();
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

