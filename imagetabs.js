(async function () {
  async function getPreferences() {
    const preferences = await browser.storage.sync.get([
      "includedProtocols",
      "includedDomains",
      "includedExtensions",
      "excludedDomains",
      "excludedExtensions"
    ]);

    return {
      includedProtocols: new Set(preferences.includedProtocols || ["http:", "https:"]),
      includedDomains: new Set(preferences.includedDomains),
      includedExtensions: new Set(preferences.includedExtensions),
      excludedDomains: new Set(preferences.excludedDomains),
      excludedExtensions: new Set(preferences.excludedExtensions),
    };
  }

  const prefs = await getPreferences();

  function isIncluded(urlObj) {
    const protocol = urlObj.protocol;
    const hostname = urlObj.hostname;
    const extension = urlObj.pathname.split('.').pop().toLowerCase();

    return prefs.includedProtocols.has(protocol) &&
      (prefs.includedDomains.has(hostname) ||
        prefs.includedExtensions.has(extension));
  }

  function isExcluded(urlObj) {
    const hostname = urlObj.hostname;
    const extension = urlObj.pathname.split('.').pop().toLowerCase();

    return prefs.excludedDomains.has(hostname) || prefs.excludedExtensions.has(extension);
  }

  const images_to_check = new Set();

  const links = document.querySelectorAll("a[href]");

  for (let link of links) {
    try {
      const urlObj = new URL(link.href);

      if (isIncluded(urlObj) && !isExcluded(urlObj)) {
        images_to_check.add(urlObj.href);
      }
    } catch (error) {
      console.error("Error processing URL:", link.href, error);
    }
  }

  if (images_to_check.size > 0) {
    browser.runtime.sendMessage([...images_to_check]);
  } else {
    alert("No new images found to open.");
  }
})();
