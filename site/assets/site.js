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
  var stage = document.querySelector('.lift__stage');
  var doors = document.querySelector('.doors');
  var OPEN_FROM = 0.1, OPEN_TO = 0.58;

  function liftProgress() {
    var r = lift.getBoundingClientRect();
    var travel = Math.max(r.height - innerHeight, 1);
    return clamp01(-r.top / travel);
  }
  function paintDoors() {
    if (!lift || !stage || reduce) return;
    var open = smooth((liftProgress() - OPEN_FROM) / (OPEN_TO - OPEN_FROM));
    stage.style.setProperty('--open', open.toFixed(4));
    doors.classList.toggle('is-open', open >= 0.999);
  }
  // Keyboard: a focused link behind closed doors is a trap. Park the act where
  // the doors are fully open instead.
  if (lift && !reduce) {
    lift.addEventListener('focusin', function () {
      if (liftProgress() >= OPEN_TO) return;
      var top = lift.getBoundingClientRect().top + scrollY;
      var travel = lift.offsetHeight - innerHeight;
      scrollTo({ top: top + travel * (OPEN_TO + 0.12), behavior: 'instant' });
    });
  }

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

  /* -------------------------------------------------------------- loop -- */
  function frame() {
    var moving = lobbyVisible && !reduce ? paintSkyline() : false;
    paintDoors();
    paintFloor();
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
