/* Fahmy Mahamud · floors 2, 3, 4 and 6
   "What I enjoy doing" with its certificate directory, the badge wall, the
   live cleaning demo and the task picker.
   Every section works as plain content without this file. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var wide = matchMedia('(min-width: 960px)');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* -------------------------------------------- 2 · enjoy: two-way links -- */
  var enjoy = $('.enjoy');
  var wires = enjoy && $('.enjoy__wires', enjoy);
  var svcs = enjoy ? $$('.svc', enjoy) : [];
  var dirItems = enjoy ? $$('.dir__item', enjoy) : [];
  var pinned = null;

  function clearTrace() {
    if (!enjoy) return;
    enjoy.classList.remove('is-tracing');
    $$('.is-lit', enjoy).forEach(function (el) { el.classList.remove('is-lit'); });
    if (wires) wires.innerHTML = '';
  }
  function wire(fromEl, toEl) {
    var box = enjoy.getBoundingClientRect();
    var a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    var x1 = a.right - box.left, y1 = a.top + a.height / 2 - box.top;
    var x2 = b.left - box.left + 2, y2 = b.top + b.height / 2 - box.top;
    var dx = Math.max((x2 - x1) * 0.5, 30);
    var d = 'M' + x1 + ' ' + y1 + 'C' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2;
    var ns = 'http://www.w3.org/2000/svg';
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    wires.appendChild(path);
    var len = path.getTotalLength();
    path.style.setProperty('--len', len.toFixed(1));
    [[x1, y1], [x2, y2]].forEach(function (pt) {
      var c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', pt[0]); c.setAttribute('cy', pt[1]); c.setAttribute('r', 3.5);
      wires.appendChild(c);
    });
  }
  function traceService(svc) {
    clearTrace();
    enjoy.classList.add('is-tracing');
    svc.classList.add('is-lit');
    var certs = (svc.getAttribute('data-certs') || '').split(' ');
    certs.forEach(function (c) {
      $$('[data-cert="' + c + '"]', svc).forEach(function (el) { el.classList.add('is-lit'); });
      var item = $('.dir__item[data-cert="' + c + '"]', enjoy);
      if (item) { item.classList.add('is-lit'); if (wide.matches) wire(svc, item); }
    });
  }
  function traceCert(item) {
    clearTrace();
    enjoy.classList.add('is-tracing');
    item.classList.add('is-lit');
    var c = item.getAttribute('data-cert');
    (item.getAttribute('data-svcs') || '').split(' ').forEach(function (sid) {
      var svc = $('.svc[data-svc="' + sid + '"]', enjoy);
      if (!svc) return;
      svc.classList.add('is-lit');
      $$('[data-cert="' + c + '"]', svc).forEach(function (el) { el.classList.add('is-lit'); });
      if (wide.matches) wire(svc, item);
    });
  }
  if (enjoy) {
    svcs.forEach(function (svc) {
      if (fine) {
        svc.addEventListener('mouseenter', function () { if (!pinned) traceService(svc); });
        svc.addEventListener('mouseleave', function () { if (!pinned) clearTrace(); });
      }
      svc.addEventListener('focus', function () { traceService(svc); });
      svc.addEventListener('blur', function () { if (!pinned) clearTrace(); });
      // touch: a tap pins the trace; tapping again (or elsewhere) clears it
      svc.addEventListener('click', function (e) {
        if (e.target.closest('a') || fine) return;
        if (pinned === svc) { pinned = null; clearTrace(); } else { pinned = svc; traceService(svc); }
      });
    });
    dirItems.forEach(function (item) {
      if (fine) {
        item.addEventListener('mouseenter', function () { if (!pinned) traceCert(item); });
        item.addEventListener('mouseleave', function () { if (!pinned) clearTrace(); });
      }
      item.addEventListener('focus', function () { traceCert(item); });
      item.addEventListener('blur', function () { if (!pinned) clearTrace(); });
      item.addEventListener('click', function () {
        if (fine) return;
        if (pinned === item) { pinned = null; clearTrace(); } else { pinned = item; traceCert(item); }
      });
    });
    document.addEventListener('click', function (e) {
      if (pinned && !e.target.closest('.svc, .dir__item')) { pinned = null; clearTrace(); }
    });
    addEventListener('resize', function () { if (!pinned) clearTrace(); });
  }

  /* ------------------------------------------------ 6 · task picker -- */
  var tabs = $$('.task');
  function selectTask(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', function () { selectTask(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTask(n, true); }
    });
  });
  // "See it in What I enjoy doing": jump there and light that card up for a moment
  $$('[data-goto]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var svc = document.getElementById('enjoy-' + a.getAttribute('data-goto'));
      if (!svc || !enjoy) return;
      e.preventDefault();
      svc.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () {
        pinned = svc; traceService(svc);
        setTimeout(function () { if (pinned === svc) { pinned = null; clearTrace(); } }, 3200);
      }, reduce ? 0 : 650);
    });
  });

  /* ------------------------------------------------ 4 · live demo -- */
  var demo = $('[data-demo]');
  if (demo) (function () {
    // Made-up maintenance log. Dates are day-first, the way they're written in Singapore.
    var RAW = [
      ['  bishan ', 'E-12', '3/9/2025', 'monthly check', 'Done'],
      ['BISHAN', 'E-12', '2025-09-03', 'Monthly Check', 'done'],
      ['Tampines Stn', 'L-04', '05 Sep 2025', 'door sensor', ''],
      ['tampines', 'L-07', '2025/09/06', 'Handrail', 'Done'],
      ['Jurong East', 'E-31', '7-9-2025', 'monthly check', 'pending'],
      ['jurong east ', 'E-31', '7/9/2025', 'Monthly check', 'Pending'],
      ['Bishan', 'L-02', '2025-09-08', 'Brake test', 'Done'],
      ['Woodlands', 'E-09', '09 Sep 2025', 'step chain', ''],
      ['  WOODLANDS', 'E-09', '9/9/2025', 'Step chain', ''],
      ['Tampines', 'E-15', '10-09-2025', 'comb plate', 'Done']
    ];
    var MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var title = function (s) { return s.toLowerCase().replace(/\b[a-z]/g, function (m) { return m.toUpperCase(); }); };
    var sentence = function (s) { s = s.trim().toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); };
    function station(s) { return title(s.trim().replace(/\s+/g, ' ').replace(/\s+stn$/i, '')); }
    function isoDate(s) {
      s = s.trim(); var m;
      if ((m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/))) return m[1] + '-' + pad(+m[2]) + '-' + pad(+m[3]);
      if ((m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/))) return m[3] + '-' + pad(+m[2]) + '-' + pad(+m[1]);
      if ((m = s.match(/^(\d{1,2}) ([A-Za-z]{3})[a-z]* (\d{4})$/))) return m[3] + '-' + pad(MONTHS[m[2].toLowerCase()]) + '-' + pad(+m[1]);
      return s;
    }
    var tbody = $('[data-demo-rows]', demo);
    var steps = $$('.demo__steps li', demo);
    var runBtn = $('[data-demo-run]', demo), resetBtn = $('[data-demo-reset]', demo);
    var status = $('[data-demo-status]', demo);
    var chart = $('[data-demo-chart]', demo), bars = $('[data-demo-bars]', demo);
    var rows, timer = 0;

    function render() {
      tbody.innerHTML = '';
      rows.forEach(function (r) {
        var tr = document.createElement('tr');
        if (r.dupe) tr.className = 'is-dupe';
        if (r.gone) tr.className = 'is-gone';
        r.cells.forEach(function (v, i) {
          var td = document.createElement('td');
          td.textContent = v === '' ? '' : v;
          if (r.changed[i]) td.className = 'is-changed';
          if (r.flagged && i === 4) td.className = 'is-flagged';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    function reset() {
      clearTimeout(timer);
      rows = RAW.map(function (r) { return { cells: r.slice(), changed: [0, 0, 0, 0, 0] }; });
      steps.forEach(function (s) { s.classList.remove('is-active', 'is-done'); });
      status.textContent = '10 raw rows, straight from a shared sheet.';
      chart.hidden = true; bars.innerHTML = '';
      runBtn.disabled = false; resetBtn.disabled = true;
      render();
    }
    function mark(i) { rows.forEach(function (r) { r.changed = [0, 0, 0, 0, 0]; }); steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); if (j < i) { s.classList.remove('is-active'); s.classList.add('is-done'); } }); }
    var STEPS = [
      function () {
        rows.forEach(function (r) {
          var a = station(r.cells[0]), t = sentence(r.cells[3]), s = r.cells[4] ? title(r.cells[4]) : '';
          if (a !== r.cells[0]) { r.cells[0] = a; r.changed[0] = 1; }
          if (t !== r.cells[3]) { r.cells[3] = t; r.changed[3] = 1; }
          if (s !== r.cells[4]) { r.cells[4] = s; r.changed[4] = 1; }
        });
        return 'Station and task names trimmed and written one way. "  bishan " and "BISHAN" are now both "Bishan".';
      },
      function () {
        rows.forEach(function (r) { var d = isoDate(r.cells[2]); if (d !== r.cells[2]) { r.cells[2] = d; r.changed[2] = 1; } });
        return 'Five date formats became one: year-month-day, so they sort properly.';
      },
      function () {
        var seen = {}, n = 0;
        rows.forEach(function (r) {
          var k = [r.cells[0], r.cells[1], r.cells[2], r.cells[3]].join('|');
          if (seen[k]) { r.dupe = true; n++; } else seen[k] = true;
        });
        return n + ' duplicates found. Same station, lift, date and task, typed in twice.';
      },
      function () {
        var n = 0;
        rows.forEach(function (r) { if (r.dupe) r.gone = true; if (!r.gone && !r.cells[4]) { r.flagged = true; r.cells[4] = 'Missing'; n++; } });
        var kept = rows.filter(function (r) { return !r.gone; }).length;
        drawChart();
        return '10 rows in, ' + kept + ' clean rows out. ' + n + ' jobs flagged with no status, so someone can follow up.';
      }
    ];
    function drawChart() {
      var counts = {};
      rows.forEach(function (r) { if (!r.gone) counts[r.cells[0]] = (counts[r.cells[0]] || 0) + 1; });
      var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); });
      var max = Math.max.apply(null, keys.map(function (k) { return counts[k]; }));
      bars.innerHTML = keys.map(function (k) {
        return '<div class="dbar"><span>' + k + '</span><span class="dbar__track"><span class="dbar__fill" style="--v:0" data-v="' + (counts[k] / max).toFixed(3) + '"></span></span><span class="dbar__n">' + counts[k] + '</span></div>';
      }).join('');
      chart.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        $$('.dbar__fill', bars).forEach(function (f) { f.style.setProperty('--v', f.getAttribute('data-v')); });
      }); });
    }
    function run() {
      runBtn.disabled = true; resetBtn.disabled = false;
      var i = 0, wait = reduce ? 250 : 1100;
      (function next() {
        mark(i);
        status.textContent = STEPS[i]();
        render();
        i++;
        if (i < STEPS.length) timer = setTimeout(next, wait);
        else timer = setTimeout(function () { steps.forEach(function (s) { s.classList.remove('is-active'); s.classList.add('is-done'); }); }, wait / 2);
      })();
    }
    runBtn.addEventListener('click', run);
    resetBtn.addEventListener('click', reset);
    reset();
  })();

  /* ------------------------------------------------ 3 · the badge wall -- */
  var wall = $('.wall');
  var fbtns = $$('.wallf');
  var wallStatus = $('[data-wall-status]');
  if (wall) {
    var tiles = $$('.badge', wall);
    tiles.forEach(function (t, i) { t.__i = i; });
    fbtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        // FLIP: remember where every tile is, regroup, then animate from the old spot
        var first = new Map();
        tiles.forEach(function (t) { first.set(t, t.getBoundingClientRect()); });
        var match = function (t) { return f === 'all' || (' ' + t.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1; };
        var order = tiles.slice().sort(function (a, c) { return (match(c) - match(a)) || (a.__i - c.__i); });
        order.forEach(function (t) { wall.appendChild(t); t.classList.toggle('is-out', !match(t)); });
        var n = order.filter(match).length;
        if (wallStatus) wallStatus.textContent = (f === 'all' ? 'Showing all ' : 'Showing ' + n + ' ' + b.firstChild.textContent + ' badges of ') + tiles.length + (f === 'all' ? ' badges.' : '.');
        if (reduce) return;
        tiles.forEach(function (t) {
          var a = first.get(t), z = t.getBoundingClientRect();
          var dx = a.left - z.left, dy = a.top - z.top;
          if (!dx && !dy) return;
          t.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
            { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
        });
      });
    });
  }
})();
