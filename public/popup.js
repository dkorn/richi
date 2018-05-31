chrome.runtime.onMessage.addListener(function(request, sender) {
  var input = document.getElementById('input')


  console.log(request)
  if (request.action == "getSource") {
    input.value = request.source;
  }
});

function onWindowLoad() {

  var message = document.getElementById('message')

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    console.log('drek')

    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
}

window.onload = onWindowLoad;