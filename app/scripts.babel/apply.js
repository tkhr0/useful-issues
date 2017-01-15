'use strict';

/*
 * issueページにテンプレートを反映する
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  var args = message.args;
  var elemTitle = document.getElementById('issue_title');
  var elemBody = document.getElementById('issue_body');

  if (elemTitle && elemBody) {
    elemTitle.value = args.title;
    elemBody.value = args.body;
  }
});
