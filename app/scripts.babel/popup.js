'use strict';

(function() {
    class Popup {
        constructor() {
            window.addEventListener('load', (evt) => {
                this.start();
            });
        }
        start() {
            this.assignEventHandlers();
            this.paint();
        }
        assignEventHandlers() {
            document.getElementById('fetch').addEventListener('click', (evt) => {
                this.onClickFetchBtn(evt);
            });
        }
        onClickFetchBtn(evt) {
            chrome.tabs.executeScript(null, {
                file: 'scripts/fetch.js'
            }, (results) => {
                if (results) {
                    var datas = results[0];
                    document.getElementById('area').value = datas.title;
                    chrome.runtime.getBackgroundPage((backgroundPage) => {
                        let bg = backgroundPage.bg;
                        bg.saveTemplate(datas.title, datas.title, datas.body);
                        this.repaint();
                    });
                } else {
                    document.getElementById('area').value = 'not found';
                }
            });
        }
        paint() {
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                let bg = backgroundPage.bg;
                bg.getAllTemplates((items) => {
                    items.forEach((template, idx, items) => {
                        console.log(template);
                        var divList = document.getElementById('list');
                        var divTemplate = document.getElementById('template').cloneNode(true);

                        divTemplate.getElementsByClassName('name')[0].text = template.name;
                        divTemplate.id = '';

                        console.log(divTemplate);
                        divList.appendChild(divTemplate);

                    });
                });
            });
        }
        repaint() {
            document.getElementById('list').innerHTML = '';
            this.paint();
        }
    }

    new Popup();
})();

