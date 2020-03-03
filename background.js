browser.browserAction.onClicked.addListener(_tab => {
  browser.tabs.executeScript({ file: "imagetabs.js" });
});

browser.runtime.onMessage.addListener((images_to_check, _sender) => {
  var images_to_open = new Array();
  var checked_images = 0;

  images_to_check.forEach(url => {
    browser.history.getVisits({ url: url }, visits => {
      if (!visits || visits.length == 0) {
        images_to_open.push(url);
      }

      checked_images++;

      if (checked_images == images_to_check.length) {
        images_to_open.slice(0, 5).forEach(url => {
          browser.tabs.create({ url: url, active: false });
        });
      }
    });
  });
});
