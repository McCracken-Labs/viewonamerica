/*!
 * Scissortail — a quiet, cookie-free page counter.
 * No cookies. No personal data stored. Honors Do Not Track.
 */
(function () {
  "use strict";
  var script = document.currentScript;
  if (!script) return;
  var endpoint = (script.getAttribute("data-endpoint") || "").replace(/\/+$/, "");
  var site = script.getAttribute("data-site") || location.host;
  if (!endpoint) return;
  var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === "1" || dnt === "yes" || navigator.globalPrivacyControl === true) return;
  if (/^(localhost|127\.|0\.0\.0\.0|\[?::1)/.test(location.hostname)) return;
  if (/bot|crawl|spider|preview|lighthouse|headless/i.test(navigator.userAgent)) return;
  function refHost() {
    try { if (!document.referrer) return ""; var u = new URL(document.referrer);
      if (u.host === location.host) return ""; return u.host; } catch (e) { return ""; }
  }
  function send() {
    try {
      var data = { site: site, p: location.pathname || "/", r: refHost(),
        s: (screen.width || 0) + "x" + (screen.height || 0) };
      var body = JSON.stringify(data);
      if (navigator.sendBeacon) { navigator.sendBeacon(endpoint + "/count", body); }
      else { var img = new Image(); img.src = endpoint + "/count?d=" + encodeURIComponent(body) + "&_=" + Date.now(); }
    } catch (e) {}
  }
  if (document.visibilityState !== "prerender") send();
  var last = location.pathname;
  function onNav() { if (location.pathname !== last) { last = location.pathname; send(); } }
  var push = history.pushState;
  if (push) { history.pushState = function () { push.apply(this, arguments); onNav(); };
    window.addEventListener("popstate", onNav); }
})();
