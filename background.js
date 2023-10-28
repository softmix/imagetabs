async function getVisitHistory(url) {
  return new Promise((resolve, reject) => {
    browser.history.getVisits({ url: url }, (visits) => {
      resolve(visits);
    });
  });
}

async function openTabs(urls) {
  for (const url of urls.slice(0, 50)) {
    await browser.tabs.create({ url: url, active: false });
  }
}

browser.browserAction.onClicked.addListener((_tab) => {
  browser.tabs.executeScript({ file: "imagetabs.js" });
});

browser.runtime.onMessage.addListener(async (images_to_check, _sender) => {
  const images_to_open = [];

  for (const url of images_to_check) {
    const visits = await getVisitHistory(url);
    if (!visits || visits.length == 0) {
      images_to_open.push(url);
    }
  }

  await openTabs(images_to_open);
});
