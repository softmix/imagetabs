(function () {
  const domains = [
    "imgur.com",
    "i.imgur.com",
    "twimg.com",
    "cdninstagram.com",
    "gfycat.com",
    "redgifs.com",
    "jiggie.fun",
    "catbox.moe",
  ];

  const fileExtensions = [
    "jpg",
    "jpeg",
    "gif",
    "png",
    "bmp",
    "webm",
    "mp4",
  ];

  const exclusions = [
    "xpi",
    "m3u8",
  ]

  function startsWithHttp(url) {
    return url.startsWith("http");
  }

  function isExcluded(url) {
    return exclusions.some((exclusion) => url.endsWith(exclusion));
  }

  function hasMatchingDomain(url) {
    return domains.some((domain) => url.includes(domain));
  }

  function hasMatchingExtension(url) {
    return fileExtensions.some((extension) => url.endsWith(extension));
  }

  const images_to_check = [];
  const links = document.getElementsByTagNameNS("*", "a");

  if (links && links.length) {
    for (let link of links) {
      const url = link.href;
      if (startsWithHttp(url) && !isExcluded(url)) {
        if (hasMatchingDomain(url) || hasMatchingExtension(url)) {
          if (!images_to_check.includes(url)) {
            images_to_check.push(url);
          }
        }
      }
    }
    browser.runtime.sendMessage(images_to_check);
  } else {
    alert("Cant access links in document!", 1);
  }
})();