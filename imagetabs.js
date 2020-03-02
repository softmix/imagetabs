var imagesregex = new RegExp(
  "://[^/]*.?((whatisnsfw|slutcapades|imagebam|babenudity|imagefap|motherless|nsfwpost|ultbabes|thiswebsiterules|phapz|phapit|flickr|imgur|drunkenstepfather|twimg|cdninstagram).com|(juvo).se/(w{4})|(pomf).is|(1339).cf|(maxfile).ro|(subimg).net|(neud).org|(assvsart).info)|(steamy).moe|.(jpg|jpeg|gif|png|bmp|webm|mp4)$",
  "i"
);
var images_to_check = new Array();
var links = document.getElementsByTagNameNS("*", "a");

if (links && links.length) {
  var len = links.length;
  for (var i = 0; i < len; ++i) {
    var u = links[i].href;
    if (
      u.substr(0, 4) == "http" &&
      u.slice(-3) != "xpi" &&
      u.slice(-4) != "m3u8" &&
      imagesregex.test(u) &&
      !inArray(u, images_to_check)
    ) {
      images_to_check.push(u);
    }
  }
  chrome.extension.sendMessage(images_to_check);
} else {
  alert("Cant access links in document!", 1);
}

function inArray(needle, haystack) {
  var length = haystack.length;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true;
  }
  return false;
}
