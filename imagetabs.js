var imagesregex = new RegExp(
  "://[^/]*.?((imgur|twimg|cdninstagram|gfycat|redgifs).com)|.(jpg|jpeg|gif|png|bmp|webm|mp4)$",
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
      !images_to_check.includes(u)
    ) {
      images_to_check.push(u);
    }
  }
  browser.runtime.sendMessage(images_to_check);
} else {
  alert("Cant access links in document!", 1);
}
