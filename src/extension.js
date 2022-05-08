'use strict'

const loaderId = setInterval(() => {
  if (!window._gmailjs) {
    return
  }

  clearInterval(loaderId)
  startExtension(window._gmailjs)
}, 100)

// actual extension-code
function startExtension (gmail) {
  console.log('Extension loading...')
  window.gmail = gmail

  gmail.observe.on('load', () => {
    const userEmail = gmail.get.user_email()
    console.log('Extension load for: ' + userEmail)

    gmail.observe.on('compose', (compose) => {
      const threads = gmail.new.get.thread_data().emails.filter(item => !item.is_draft)
      const emailObjects = []
      threads.forEach(item => {
        emailObjects.push({
          from_email: item.from.address,
          from_name: item.from.name,
          to_emails: item.to.map(item => item.address),
          to_names: item.to.map(item => item.name),
          timestamp: item.timestamp,
          subject: item.subject,
          body_html: item.content_html
        })
      })
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage(window.messageSuggestionExtensionID, { emailObjects, url: location.href.toString() }, response => {
        if (response.suggestion) {
          document.querySelector('.editable').innerHTML = response.suggestion
        }
      })
    })
  })
}
