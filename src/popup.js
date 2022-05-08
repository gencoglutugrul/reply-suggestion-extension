const info = document.querySelector('#info')
const suggest = document.querySelector('#suggest')

// eslint-disable-next-line no-undef
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0]
  const resultTab = activeTab.url.match(/https:\/\/mail.google\.com\/mail\/u\/[0-9]\/#[a-zA-Z]+\/(.*)/)
  if (resultTab.length === 2 && resultTab[1].length !== 0) {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ getLastState: true }, response => {
      response = response.lastState

      if (response.url) {
        const responseMatch = response.url.match(/https:\/\/mail.google\.com\/mail\/u\/[0-9]\/#[a-zA-Z]+\/(.*)/)
        const logic = responseMatch.length === 2 &&
          responseMatch[1].replace(/^[\\/]+|[\\/]+$/g, '') === resultTab[1].replace(/^[\\/]+|[\\/]+$/g, '')

        if (logic) {
          if (response.suggestions.length === 0) {
            info.innerHTML = response.error ? response.error : 'No Suggestion!'
          } else {
            suggest.innerHTML = ''
            info.innerHTML = 'Found ' + response.suggestions.length + ' suggestion(s)'
            response.suggestions.forEach((suggestion, index) => {
              suggest.innerHTML += (index + 1) + ': ' + suggestion + '<br/><br/>'
            })
          }
        } else {
          info.innerHTML = 'Please click reply to see suggestions'
        }
      }
    })
  }
})
