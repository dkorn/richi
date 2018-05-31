let source;
chrome.runtime.onMessage.addListener(function(request, sender) {
  const hiddenInput = document.getElementById('hidden')
  var event = new Event('input', { bubbles: true });

  console.log(request)
  if (request.action == "getSource") {
    hiddenInput.value = request.source;
    //hiddenInput.dispatchEvent(event);
    source = request.source;

  }
});

function onWindowLoad() {

  var message = document.getElementById('message')

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {

    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
     console.log('There was an error injecting script : \n' + chrome.runtime.lastError.message);
    }
  });
}

window.onload = onWindowLoad;
