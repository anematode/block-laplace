// This file is run right before the body of the page loads

// Create a script tag in the document
var script = document.createElement('script');

// Set its src (source) to "inject.js," which is the payload we use
script.src = chrome.extension.getURL('inject.js');

// When the script finishes loading, remove this context because it's no longer useful
script.onload = function() {
    this.remove();
};

// Insert the script tag into the document
(document.head || document.documentElement).appendChild(script);