chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({ file: "imagetabs.js" });
});

browser.runtime.onMessage.addListener(function(images_to_check, sender) {
  var images_to_open = new Array();
  var checked_images = 0;

  //console.dir(images_to_check);

  images_to_check.forEach(function(url) {
    chrome.history.getVisits({ url: url }, function(visits) {
      if (!visits || visits.length == 0) {
        images_to_open.push(url);
      }
      checked_images++;
      if (checked_images == images_to_check.length) {
        openImages(images_to_open.slice(0, 50));
      }
    });
  });
});

var openImages = function(images_to_open) {
  //console.dir(images_to_open);
  images_to_open.forEach(function(url) {
    chrome.tabs.create({ url: url, active: false }, function(tab) {
      // Tab opened.
    });
  });
};
