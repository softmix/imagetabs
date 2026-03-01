function getVisitHistory(url) {
  return browser.history.getVisits({ url });
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

  const total = images_to_open.length;
  const count = Math.min(total, 50);
  browser.browserAction.setBadgeText({ text: count > 0 ? String(count) : "" });
  browser.browserAction.setBadgeBackgroundColor({ color: total > 50 ? "#c44" : "#666" });
  if (total > 50) {
    console.warn(`imagetabs: opened 50 of ${total} images (limit reached)`);
  }

  if (count > 0) {
    const { totalOpened = 0 } = await browser.storage.local.get("totalOpened");
    await browser.storage.local.set({ totalOpened: totalOpened + count });
  }
});

browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "install" && details.reason !== "update") return;

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
  const currentSettings = await browser.storage.sync.get(keys);

  const settingsToSet = {};
  for (const key of keys) {
    if (currentSettings[key] === undefined) {
      settingsToSet[key] = defaultSettings[key];
    }
  }

  if (Object.keys(settingsToSet).length > 0) {
    await browser.storage.sync.set(settingsToSet);
  }
});