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

browser.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install" || details.reason === "update") {
    const defaultSettings = {
      includedProtocols: ["http:", "https:"],
      includedDomains: [
        "imgur.com",
        "i.imgur.com",
        "twimg.com",
        "cdninstagram.com",
        "gfycat.com",
        "redgifs.com",
        "jiggie.fun",
        "puzzle.aggie.io",
        "catbox.moe",
      ],
      includedExtensions: [
        "jpg",
        "jpeg",
        "gif",
        "png",
        "bmp",
        "webm",
        "mp4",
      ],
      excludedDomains: [
        "saucenao.com",
        "imgops.com",
        "iqdb.org",
        "google.com",
      ],
      excludedExtensions: [
        "xpi",
        "m3u8",
      ],
    };


    const keys = Object.keys(defaultSettings);
    browser.storage.sync.get(keys, (currentSettings) => {
      if (browser.runtime.lastError) {
        console.error(`Error retrieving settings: ${browser.runtime.lastError}`);
        return;
      }

      const settingsToSet = {};
      keys.forEach((key) => {
        if (currentSettings[key] === undefined) {
          settingsToSet[key] = defaultSettings[key];
        }
      });

      if (Object.keys(settingsToSet).length > 0) {
        browser.storage.sync.set(settingsToSet, () => {
          if (browser.runtime.lastError) {
            console.error(`Error setting default settings: ${browser.runtime.lastError}`);
          } else {
            console.log("Default settings set successfully");
          }
        });
      }
    });
  }
});