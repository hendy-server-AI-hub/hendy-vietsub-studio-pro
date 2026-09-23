(function() {
  if (window.__vietsubInjected) { 
    document.getElementById('__vietsubPanel').remove();
    window.__vietsubInjected = false;
    return; 
  }
  window.__vietsubInjected = true;
  
  var panel = document.createElement('div');
  panel.id = '__vietsubPanel';
  panel.style.cssText = 'position:fixed;bottom:16px;right:16px;width:360px;background:#1a1a2e;color:#e0e0e0;border-radius:12px;padding:16px;z-index:2147483647;box-shadow:0 8px 32px rgba(0,0,0,.5);font-family:system-ui,sans-serif';
  panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="font-size:16px;color:#a29bfe;margin:0">Vietsub AI</h3><button id="__vietsubClose" style="background:none;border:none;color:#888;font-size:20px;cursor:pointer">x</button></div><div style="margin-bottom:8px"><label style="font-size:12px;color:#888;display:block;margin-bottom:4px">Dán link SRT/VTT hoặc nhập phụ đề:</label><input id="__vietsubUrl" type="text" placeholder="https://... vietsub.srt" style="width:100%;padding:6px;background:#0f0f1a;border:1px solid #2a2a48;border-radius:4px;color:#e0e0e0;font-size:12px;margin-bottom:6px"></div><div style="margin-bottom:8px"><textarea id="__vietsubInput" placeholder="1\n00:00:01,000 --> 00:00:03,000\nXin chào..." style="width:100%;height:80px;padding:6px;background:#0f0f1a;border:1px solid #2a2a48;border-radius:4px;color:#e0e0e0;font-size:12px;resize:vertical"></textarea></div><div style="display:flex;gap:6px;margin-bottom:8px"><select id="__vietsubMode" style="padding:4px;background:#0f0f1a;border:1px solid #2a2a48;border-radius:4px;color:#e0e0e0;font-size:12px"><option value="vi">Chỉ Tiếng Việt</option><option value="bilingual" selected>Song ngữ</option></select><button id="__vietsubLoad" style="flex:1;padding:6px;background:#6c5ce7;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px">Tải phụ đề</button></div><div id="__vietsubStatus" style="font-size:11px;color:#888;text-align:center"></div><div style="margin-top:8px;display:flex;gap:4px;align-items:center"><label style="font-size:11px;color:#888">Sync:</label><button id="__vietsubSyncM" style="padding:2px 8px;background:#2a2a48;border:none;border-radius:3px;color:#e0e0e0;cursor:pointer;font-size:11px">-0.5s</button><button id="__vietsubSyncR" style="padding:2px 8px;background:#2a2a48;border:none;border-radius:3px;color:#e0e0e0;cursor:pointer;font-size:11px">0</button><button id="__vietsubSyncP" style="padding:2px 8px;background:#2a2a48;border:none;border-radius:3px;color:#e0e0e0;cursor:pointer;font-size:11px">+0.5s</button></div>';
  document.body.appendChild(panel);
  
  document.getElementById('__vietsubClose').onclick = function() { 
    panel.remove(); 
    window.__vietsubInjected = false; 
  };
  
  var cues = [];
  var offset = 0;
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;bottom:40px;left:50%;transform:translateX(-50%);max-width:80%;text-align:center;pointer-events:none;z-index:2147483646;font-size:22px;font-weight:bold;text-shadow:2px 2px 4px #000,-2px -2px 4px #000,2px -2px 4px #000,-2px 2px 4px #000;color:#fff';
  overlay.style.display = 'none';
  document.body.appendChild(overlay);
  
  function hms(s){return parseInt(s[0])*3600+parseInt(s[1])*60+parseInt(s[2])+parseInt(s[3])/1000}
  function parseSRT(text){var b=text.trim().split(/\n\s*\n/);var r=[];b.forEach(function(bl){var l=bl.trim().split('\n');if(l.length<2)return;var m=l[1].match(/(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)/);if(!m)return;r.push({start:hms([m[1],m[2],m[3],m[4]]),end:hms([m[5],m[6],m[7],m[8]]),text:l.slice(2).join(' ')})});return r}
  
  document.getElementById('__vietsubLoad').onclick = async function() {
    var url = document.getElementById('__vietsubUrl').value.trim();
    var input = document.getElementById('__vietsubInput').value.trim();
    if (url) {
      try {
        var r = await fetch(url);
        var t = await r.text();
        cues = parseSRT(t);
        document.getElementById('__vietsubStatus').textContent = 'Loaded ' + cues.length + ' cues';
      } catch(e) { document.getElementById('__vietsubStatus').textContent = 'Error: ' + e.message; }
    } else if (input) {
      cues = parseSRT(input);
      document.getElementById('__vietsubStatus').textContent = 'Loaded ' + cues.length + ' cues';
    }
  };
  
  document.getElementById('__vietsubSyncM').onclick = function(){offset -= 0.5};
  document.getElementById('__vietsubSyncR').onclick = function(){offset = 0};
  document.getElementById('__vietsubSyncP').onclick = function(){offset += 0.5};
  
  var v = document.querySelector('video');
  if (!v) { document.getElementById('__vietsubStatus').textContent = 'No video found!'; return; }
  
  function tick() {
    if (cues.length === 0) { requestAnimationFrame(tick); return; }
    var t = v.currentTime + offset;
    var c = cues.find(function(c){return t >= c.start && t <= c.end});
    if (c) {
      overlay.textContent = c.text;
      overlay.style.display = 'block';
    } else {
      overlay.style.display = 'none';
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
