const API_ENDPOINT = 'https://exampleendpoint.com/get_suggested_text'

let lastState = {}

// eslint-disable-next-line no-undef
chrome.runtime.onMessageExternal.addListener((request, _sender, sendResponse) => {
  if (request.emailObjects) {
    const emailObjects = request.emailObjects
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ msg: emailObjects.pop(), thread: emailObjects })
    })
      .then(response => response.json())
      .then(data => {
        lastState = { suggestions: data, url: request.url }
        if (data.length !== 0) {
          sendResponse({ suggestion: data[0] })
        }
      })
      .catch(reason => {
        lastState = { url: request.url, suggestions: [], error: "Error: Can't connect to API endpoint.\nReason: " + reason.toString() }
      })
  }
})

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.getLastState) {
    sendResponse({ lastState })
  }
})

// eslint-disable-next-line no-undef
chrome.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => {
  if (tab.url) {
    if (tab.url.match(/^https:\/\/mail.google\.com\/mail\/u\/[0-9]\/#[a-zA-Z]+\//)) {
      // eslint-disable-next-line no-undef
      chrome.scripting.executeScript({
        target: { tabId },
        func: (extensionID) => {
          window.messageSuggestionExtensionID = extensionID
        },
        // eslint-disable-next-line no-undef
        args: [chrome.runtime.id],
        world: 'MAIN'
      })
    }
  }
})
