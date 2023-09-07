"use strict";

(function () {
  var script = document.currentScript;
  var alias = script.dataset.embed_id;
  var blockquoteId = "blind-embed-".concat(alias);
  var loadingBlockquoteId = "blind-embed-"
    .concat(alias, "-loading-")
    .concat(Date.now());
  var framePreload = function framePreload(url) {
    var frameObject = document.createElement("iframe");
    frameObject.src = url;
    frameObject.height = "0"; // height set to 0
    frameObject.width = "100%";
    frameObject.style =
      "display:block; max-width: 512px;border:none; overflow:hidden; margin: 0 auto;";
    frameObject.scrolling = "no";
    frameObject.loading = "lazy";
    frameObject.frameborder = "0";
    frameObject.allowfullscreen = "true";
    frameObject.allow =
      "autoplay; clipboard-write; encrypted-media; picture-in-picture;";
    frameObject.style.visibility = "hidden"; // set to hidden to actually load the image
    return frameObject;
  };
  var handleLoad = function handleLoad(iframe) {
    console.log("iframe loaded, set the height");
    var loading = document.getElementById(loadingBlockquoteId);
    console.log("loading", loading);
    iframe.height = '100%';
    iframe.style.visibility = "visible";
    iframe.style.minHeight = "300px";

    if (loading && loading.parentNode) {
      loading.parentNode.removeChild(loading); // remove the blockquote object
    }

    window.addEventListener(
      "message",
      function (e) {
        console.log("current iframe", iframe);

        var message = e.data;
        console.log("message sent", message);
        if (e.source == iframe.contentWindow && message.height) {
          iframe.height = message.height;
          iframe.style.minHeight = null;
        }

      },
      false
    );
  };
  var blockquote = document.getElementById(blockquoteId);
  console.log("the blockquote", blockquote);
  blockquote.id = loadingBlockquoteId;
  var genIframe = framePreload(blockquote.dataset.blindPermalink);
  console.log("iframe", genIframe);
  genIframe.onload = function () {
    handleLoad(genIframe, blockquote);
  };
  blockquote.parentNode.insertBefore(genIframe, blockquote);
})();