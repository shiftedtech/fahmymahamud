/* Fahmy Mahamud · page script
   Everything bespoke to this site lives here: the skyline, the lift doors and
   the floor indicator. The scrollcraft engine is mounted untouched. */
(function () {
  var doc = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var smooth = function (x) { x = clamp01(x); return x * x * (3 - 2 * x); };

  // Under reduced motion the doors never render, so the pinned act would be a
  // long static hold. Turn it into an ordinary section before the engine reads it.
  var lift = document.querySelector('.lift');
  if (reduce && lift) lift.removeAttribute('data-sc-act');
  // The escalator is a pinned 3D ride only with motion allowed and the engine
  // present; otherwise it stays a plain grid of four cards.
  var esc = document.querySelector('.esc3d');
  if (esc && reduce) esc.removeAttribute('data-sc-act');
  var escLive = !!(esc && !reduce && window.ScrollCraft);
  if (escLive) esc.classList.add('is-live');

  if (window.ScrollCraft) ScrollCraft.mount(document.body);

  /* ------------------------------------------------------------ skyline -- */
  var lobby = document.querySelector('.lobby');
  var layers = Array.prototype.map.call(document.querySelectorAll('.sk-layer'), function (el) {
    return { el: el, d: parseFloat(el.getAttribute('data-depth')) || 0 };
  });

  // Give every window and canopy its own rhythm, so the city never pulses in unison.
  Array.prototype.forEach.call(document.querySelectorAll('.win'), function (w, i) {
    var r = Math.sin(i * 12.9898) * 43758.5453; r -= Math.floor(r);
    var r2 = Math.sin(i * 78.233) * 12345.678; r2 -= Math.floor(r2);
    w.style.setProperty('--tw', (2.5 + r * 6).toFixed(2) + 's');
    w.style.setProperty('--td', (-r2 * 8).toFixed(2) + 's');
    if (reduce && r < 0.35) w.style.opacity = '.35';
  });
  Array.prototype.forEach.call(document.querySelectorAll('.glow'), function (g, i) {
    g.style.setProperty('--gl', (3.6 + (i % 3) * 0.9).toFixed(2) + 's');
    g.style.setProperty('--gd', (-i * 1.3).toFixed(2) + 's');
  });

  // Phones get their own crop: Supertrees, Marina Bay Sands, ArtScience and the
  // whole Flyer, instead of a centre slice that cuts the wheel in half.
  var svg = document.querySelector('.skyline__svg');
  var phoneMQ = matchMedia('(max-width: 700px)');
  function artDirect() {
    if (svg) svg.setAttribute('viewBox', phoneMQ.matches ? '380 40 760 380' : '0 0 1440 420');
  }
  artDirect();
  if (phoneMQ.addEventListener) phoneMQ.addEventListener('change', artDirect);

  var pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 };
  var lobbyVisible = true, running = false;

  if (!reduce && finePointer && lobby) {
    addEventListener('pointermove', function (e) {
      if (!lobbyVisible) return;
      pointer.x = e.clientX / innerWidth - 0.5;
      pointer.y = e.clientY / innerHeight - 0.5;
      kick();
    }, { passive: true });
  }

  function paintSkyline() {
    eased.x += (pointer.x - eased.x) * 0.08;
    eased.y += (pointer.y - eased.y) * 0.08;
    var sy = Math.min(scrollY, innerHeight);
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      // Pointer: nearer planes lean further. Scroll: farther planes lag, so the
      // city sinks behind the water as you leave the lobby.
      var tx = -eased.x * 34 * L.d;
      var ty = -eased.y * 10 * L.d + sy * 0.16 * (1 - L.d);
      L.el.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px)';
    }
    return Math.abs(pointer.x - eased.x) > 0.001 || Math.abs(pointer.y - eased.y) > 0.001;
  }

  /* -------------------------------------------------------- lift doors -- */
  /* --------------------------------------------------------- lift doors -- */
  // A real lift: when you reach floor 3 the car arrives (arrow stops, lanterns
  // light), the doors open on a timer, then you step in as the landing fades.
  // Time-based, so a fast flick on a phone cannot skip it. Scroll back above
  // the floor and it resets, ready to arrive again.
  var landing = document.querySelector('.landing');
  var liftState = 0, liftTimers = [];
  function liftAt(state) {
    liftTimers.forEach(clearTimeout);
    liftTimers = [];
    liftState = state;
    landing.classList.toggle('is-arrived', state >= 1);
    landing.classList.toggle('is-open', state >= 2);
    landing.classList.toggle('is-in', state >= 3);
  }
  function paintDoors() {
    if (!lift || !landing || reduce) return;
    var r = lift.getBoundingClientRect();
    if (liftState === 0 && r.top <= innerHeight * 0.08 && r.bottom > innerHeight * 0.6) {
      liftAt(1);
      liftTimers.push(setTimeout(function () {
        liftAt(2);
        liftTimers.push(setTimeout(function () { liftAt(3); }, 1500));
      }, 550));
    } else if (liftState > 0 && r.top > innerHeight * 0.5) {
      liftAt(0);
    }
  }
  // Keyboard: a focused link behind closed doors is a trap. Open them at once.
  if (lift && landing && !reduce) lift.addEventListener('focusin', function () { liftAt(3); });

  /* ---------------------------------------------------------- escalator -- */
  // After the Gemini "3D escalator scroll showcase": a pinned stage, a tilted
  // escalator whose steps and handrails run with the scroll, and four project
  // cards riding the incline from the bottom landing to the top one.
  if (escLive) (function () {
    var stageEl = esc.querySelector('.esc3d__stage');
    var scene = esc.querySelector('.esc3d__scene');
    var cards = Array.prototype.slice.call(esc.querySelectorAll('.card3d'));
    var stepsBelt = esc.querySelector('.esc3d__belt--steps');
    var rails = Array.prototype.slice.call(esc.querySelectorAll('.esc3d__belt--rail'));
    var posEl = esc.querySelector('.esc3d__pos');
    var nowEl = esc.querySelector('.esc3d__now');
    var dirEl = esc.querySelector('.esc3d__dir');
    var levelBtns = Array.prototype.slice.call(esc.querySelectorAll('[data-level]'));
    var titles = cards.map(function (c) { return c.querySelector('.card3d__title').textContent; });
    // Each card owns its own stretch of scroll: it rides in, slows to a near-stop
    // in the middle of the incline while you read it, then rides out before the
    // next card arrives. u is the card's own progress through that stretch.
    var N = 3.7, LEAD = 0.15;
    function cardU(p, i) { return p * N - i + LEAD; }
    function uToT(u) {
      if (u < 0) return u * 2;                            // still below the landing
      if (u < 0.2) return u / 0.2 * 0.42;                 // ride in
      if (u < 0.8) return 0.42 + (u - 0.2) / 0.6 * 0.16;  // the reading hold
      if (u < 1) return 0.58 + (u - 0.8) / 0.2 * 0.42;    // ride out
      return 1 + (u - 1) * 2;
    }
    var cur = 0, last = 0, still = 0, raf = 0, visible = false, lastT = 0;
    var W = 0, H = 0, mobile = false, cw = 400, ch = 420;

    function progress() {
      var r = esc.getBoundingClientRect();
      return clamp01(-r.top / Math.max(r.height - innerHeight, 1));
    }
    function pAt(i) { return clamp01((i + 0.5 - LEAD) / N); }
    function measure() {
      W = stageEl.clientWidth; H = stageEl.clientHeight; mobile = W < 700;
      cw = mobile ? Math.min(W - 76, 330) : Math.min(400, W * 0.34);
      esc.style.setProperty('--cw', cw + 'px');
      ch = cards[0].offsetHeight || cw;
      var sc = mobile ? Math.max(W / 820, 0.42) : Math.min(W / 1300, H / 850) * 0.95;
      scene.style.setProperty('--s', sc.toFixed(3));
    }
    function path(t) {
      var sx, sy, ex, ey;
      // bottom-left landing up to the top-right one, along the visible incline
      if (mobile) { var u = W - 52; sx = u * 0.44 + 4; sy = H * 0.62; ex = u * 0.56 + 4; ey = H * 0.44; }
      else { sx = W * 0.34; sy = H * 0.68; ex = W * 0.68; ey = H * 0.42; }
      var bump = Math.sin(t * Math.PI);
      var pitch = t < 0.15 ? t / 0.15 * 14 : t > 0.85 ? (1 - t) / 0.15 * 14 : 14;
      return {
        x: sx + (ex - sx) * t - cw / 2,
        y: sy + (ey - sy) * t - ch / 2,
        z: (bump * 160 + (1 - t) * 40) * (mobile ? 0.35 : 1),
        s: mobile ? 0.9 + bump * 0.1 : 0.85 + bump * 0.22,
        pitch: mobile ? pitch * 0.5 : pitch
      };
    }
    function render(now) {
      raf = 0;
      var target = progress();
      // Same glide at any frame rate: 0.085 per 60fps frame, scaled by real elapsed time.
      var dt = now && lastT ? Math.min(now - lastT, 250) : 16.7;
      lastT = now;
      cur += (target - cur) * (1 - Math.pow(1 - 0.085, dt / 16.7));
      if (Math.abs(target - cur) < 0.0004) cur = target;
      var d = cur - last; last = cur;
      // The conveyor moves with the scroll, plus a slow idle crawl, like a real escalator.
      var idle = (now || 0) * 0.012;
      stepsBelt.style.transform = 'translate3d(' + (-((cur * 1800 + idle) % 96)).toFixed(1) + 'px,0,0)';
      var ro = 'translate3d(' + (-((cur * 2400 + idle * 1.3) % 90)).toFixed(1) + 'px,0,0)';
      rails.forEach(function (r) { r.style.transform = ro; });
      var best = 0, bestD = 9;
      cards.forEach(function (c, i) {
        var t = uToT(cardU(cur, i));
        var dist = Math.abs(t - 0.5);
        if (dist < bestD) { bestD = dist; best = i; }
        if (t < -0.12 || t > 1.12) { c.style.opacity = '0'; c.style.pointerEvents = 'none'; c.classList.remove('is-focal'); return; }
        var pt = path(clamp01(t));
        // phones show one card at a time: a clean crossfade between neighbours
        var op = mobile ? (t < 0.25 ? 0 : t < 0.4 ? (t - 0.25) / 0.15 : t < 0.6 ? 1 : t < 0.75 ? (0.75 - t) / 0.15 : 0)
                        : (t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1);
        op = clamp01(op);
        c.style.opacity = op.toFixed(3);
        c.style.pointerEvents = op > 0.4 ? 'auto' : 'none';
        c.style.transform = 'translate3d(' + pt.x.toFixed(1) + 'px,' + pt.y.toFixed(1) + 'px,' + pt.z.toFixed(1) + 'px) scale(' + pt.s.toFixed(3) + ') rotateX(' + (-pt.pitch).toFixed(2) + 'deg)';
        c.style.zIndex = String(Math.round(pt.z + 100));
        c.classList.toggle('is-focal', dist < 0.18);
      });
      posEl.textContent = Math.round(cur * 100) + '%';
      nowEl.textContent = titles[best];
      var dir = Math.abs(d) > 0.0002 ? (d > 0 ? 'up' : 'down') : '';
      if (dir) { dirEl.setAttribute('data-dir', dir); dirEl.textContent = dir === 'up' ? '▲ Ascending' : '▼ Descending'; still = 0; }
      else if (++still > 12) { dirEl.removeAttribute('data-dir'); dirEl.textContent = 'Stationary'; }
      levelBtns.forEach(function (b, i) {
        if (i === best) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      if (visible) raf = requestAnimationFrame(render);
    }
    function scrollToCard(i, smoothly) {
      var top = esc.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + (esc.offsetHeight - innerHeight) * pAt(i), behavior: smoothly ? 'smooth' : 'instant' });
    }
    levelBtns.forEach(function (b, i) { b.addEventListener('click', function () { scrollToCard(i, true); }); });
    // Keyboard: tabbing to a card that has not ridden into view parks the ride on it.
    cards.forEach(function (c, i) {
      c.addEventListener('focus', function () {
        if (Math.abs(uToT(cardU(progress(), i)) - 0.5) > 0.2) { scrollToCard(i, false); cur = last = progress(); }
      });
    });
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(render);
    }).observe(esc);
    addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    addEventListener('load', measure);
    measure();
    cur = last = progress();
    render(0);
  })();

  /* --------------------------------------------------- floor indicator -- */
  var nav = document.querySelector('.lift-nav');
  var btn = nav && nav.querySelector('.lift-nav__display');
  var panel = nav && nav.querySelector('.lift-nav__panel');
  var floorEl = nav && nav.querySelector('.lift-nav__floor');
  var nameEl = nav && nav.querySelector('.lift-nav__name');
  var floors = Array.prototype.slice.call(document.querySelectorAll('[data-floor]'));
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('[data-floor-link]')) : [];
  var current = -1, dirTimer = 0;

  function paintFloor() {
    if (!nav) return;
    var probe = innerHeight * 0.42, idx = 0;
    for (var i = 0; i < floors.length; i++) {
      if (floors[i].getBoundingClientRect().top <= probe) idx = i;
    }
    // The last floor is short; count it as reached once the page bottoms out.
    if (innerHeight + scrollY >= doc.scrollHeight - 4) idx = floors.length - 1;
    if (idx === current) return;
    var prev = current;
    current = idx;
    var f = floors[idx];
    floorEl.textContent = f.getAttribute('data-floor');
    nameEl.textContent = f.getAttribute('data-floor-name');
    links.forEach(function (a) {
      if (a.getAttribute('data-floor-link') === f.getAttribute('data-floor')) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    if (prev === -1) return;
    // Scrolling down the page rides the lift up.
    nav.setAttribute('data-dir', idx > prev ? 'up' : 'down');
    clearTimeout(dirTimer);
    dirTimer = setTimeout(function () { nav.removeAttribute('data-dir'); }, 900);
    if (!reduce && idx === floors.length - 1) {
      floorEl.classList.remove('is-ding'); void floorEl.offsetWidth; floorEl.classList.add('is-ding');
    }
  }

  // Follow the page like the browser's scrollbar thumb.
  var EDGE = 16;
  if (nav) nav.classList.add('is-tracking');
  function paintNavPosition() {
    if (!nav) return;
    var max = doc.scrollHeight - innerHeight;
    var p = max > 0 ? clamp01(scrollY / max) : 0;
    var room = innerHeight - btn.offsetHeight - EDGE * 2;
    var y = EDGE + p * Math.max(room, 0);
    nav.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    nav.setAttribute('data-half', y + btn.offsetHeight / 2 < innerHeight / 2 ? 'top' : 'bottom');
  }

  function setPanel(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (nav) {
    btn.addEventListener('click', function () {
      var open = panel.hidden;
      setPanel(open);
      if (open) (panel.querySelector('[aria-current]') || panel.querySelector('a')).focus();
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setPanel(false);
    });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { setPanel(false); btn.focus(); }
    });
    document.addEventListener('pointerdown', function (e) {
      if (!panel.hidden && !nav.contains(e.target)) setPanel(false);
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var items = Array.prototype.slice.call(panel.querySelectorAll('a'));
      var i = items.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
    });
  }

  /* -------------------------------------------------------------- email -- */
  // The Gmail logo is a mailto with a subject and message ready. If nothing on
  // this device handles mailto (common on desktops with no mail app set up),
  // the page never loses focus, so open Gmail's web compose with the same draft.
  Array.prototype.forEach.call(document.querySelectorAll('a[data-gmail-fallback]'), function (a) {
    a.addEventListener('click', function () {
      var left = false;
      function gone() { left = true; }
      addEventListener('blur', gone);
      document.addEventListener('visibilitychange', gone);
      setTimeout(function () {
        removeEventListener('blur', gone);
        document.removeEventListener('visibilitychange', gone);
        if (left || !document.hasFocus()) return;
        var url = a.getAttribute('data-gmail-fallback');
        var w = window.open(url, '_blank');
        if (w) w.opener = null; else location.href = url;
      }, 1200);
    });
  });

  /* -------------------------------------------------------------- loop -- */
  function frame() {
    var moving = lobbyVisible && !reduce ? paintSkyline() : false;
    paintDoors();
    paintFloor();
    paintNavPosition();
    if (moving) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);

  // Pause the city when it is off screen or the tab is hidden.
  if (lobby && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      lobbyVisible = entries[0].isIntersecting;
      lobby.classList.toggle('is-offscreen', !lobbyVisible);
    }).observe(lobby);
  }
  document.addEventListener('visibilitychange', function () {
    if (lobby) lobby.classList.toggle('is-offscreen', document.hidden || !lobbyVisible);
  });

  kick();
})();
