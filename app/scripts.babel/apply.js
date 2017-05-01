'use strict';

/*
 * issueページにテンプレートを反映する
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  var args = message.args;

  var elemTitle, elemBody;
  var url = window.location.href;
  if (url.match(new RegExp('github\.com/.+/compare/.+'))) {
    // when PR
    elemTitle = document.getElementById('pull_request_title');
    elemBody = document.getElementById('pull_request_body');
  } else if (url.match(new RegExp('github\.com/.+/issues/new'))) {
    // when issue
    elemTitle = document.getElementById('issue_title');
    elemBody = document.getElementById('issue_body');
  }

  if (elemTitle && elemBody) {
    elemTitle.value = args.title;
    elemBody.value = args.body;
  }
});
