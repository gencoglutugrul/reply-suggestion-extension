'use strict'

function addScript (src) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  // eslint-disable-next-line no-undef
  script.src = chrome.runtime.getURL(src);
  (document.body || document.head || document.documentElement).appendChild(script)
}

addScript('dist/gmailJsLoader.js')
addScript('dist/extension.js')
