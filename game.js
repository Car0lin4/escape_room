/* ---------------------------------------------------------------------------
   Escape Room — game flow

   entrance -> door wall -> lock -> room -> (hint) -> question -> back to wall
   A solved door disappears from the wall. A wrong answer costs a life.

   Every door is locked: clicking one raises a small Ley 100 puzzle (locks.js)
   and the room only opens once that puzzle is beaten.
--------------------------------------------------------------------------- */

const $ = (id) => document.getElementById(id);

const state = {
  lives: LIVES,
  solved: new Set(),
  unlocked: new Set(),   // doors whose lock has already been picked
  current: null,   // the room object currently being played
  teaseTimer: null,
};

/* --- scale the fixed 1280x832 stage to fit the window --------------------- */
function fitStage() {
  const s = Math.min(innerWidth / 1280, innerHeight / 832);
  $('stage').style.transform = `translate(-50%, -50%) scale(${s})`;
}
addEventListener('resize', fitStage);

/* --- screens -------------------------------------------------------------- */
function show(name) {
  for (const el of document.querySelectorAll('.screen')) el.hidden = true;
  $('screen-' + name).hidden = false;
  $('lives').hidden = name === 'entrance';
}

/* --- lives ---------------------------------------------------------------- */
function renderLives() {
  const box = $('lives');
  box.innerHTML = '';
  for (let i = 0; i < LIVES; i++) {
    const h = document.createElement('span');
    h.className = 'life' + (i < state.lives ? '' : ' lost');
    box.appendChild(h);
  }
}

function loseLife() {
  state.lives--;
  const hearts = $('lives').children;
  const lost = hearts[state.lives];
  if (lost) {
    lost.classList.add('lost', 'popping');
    lost.addEventListener('animationend', () => lost.classList.remove('popping'), { once: true });
  }
  return state.lives > 0;
}

/* --- 2. door wall --------------------------------------------------------- */
function buildWall() {
  const box = $('doors');
  box.innerHTML = '';

  for (const room of ROOMS) {
    const d = room.door;
    const btn = document.createElement('button');
    btn.className = 'door' + (room.question ? '' : ' locked');
    btn.style.cssText = `
      left:${d.x}px; top:${d.y}px; width:${d.w}px; height:${d.h}px;
      background-image:url('${d.img}');
      background-size:${d.size};
      background-position:${d.pos};
      opacity:${d.opacity};
    `;
    btn.setAttribute('aria-label', `Door ${room.id}`);

    if (state.solved.has(room.id)) btn.classList.add('solved');

    btn.addEventListener('click', () => {
      if (state.solved.has(room.id)) return;
      if (!room.question) {
        toast(`Door ${room.id} isn't ready yet.`);
        return;
      }
      // the lock comes first, and only has to be picked once
      if (room.lock && !state.unlocked.has(room.id)) {
        openLock(room, () => {
          state.unlocked.add(room.id);
          openRoom(room);
        });
        return;
      }
      openRoom(room);
    });

    box.appendChild(btn);
  }

  const left = ROOMS.filter(r => !state.solved.has(r.id)).length;
  $('wall-prompt').textContent =
    left === ROOMS.length ? 'pick a door — every one of them is locked'
    : left ? `${left} ${left === 1 ? 'door' : 'doors'} left`
    : 'every door is open…';
}

function toast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  $('screen-wall').appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

/* --- 3. room -------------------------------------------------------------- */
function openRoom(room) {
  state.current = room;

  // Bled 5px past every edge: the source photos carry a thin pale border that
  // would otherwise show as a hairline frame around the room.
  Object.assign($('room-photo').style, {
    left: '-5px', top: '-5px', width: '1290px', height: '842px',
    backgroundImage: `url('${room.photo}')`,
    backgroundSize: 'cover',
    backgroundPosition: '50%',
  });
  Object.assign($('room-scrim').style, {
    left: '0px', top: '0px', width: '1280px', height: '832px',
    background: ROOM_SCRIM,
  });

  const h = room.hotspot;
  Object.assign($('hotspot').style, {
    left: h.x + 'px', top: h.y + 'px', width: h.w + 'px', height: h.h + 'px',
  });
  $('hotspot').classList.remove('tease');

  $('hint-text').textContent = room.hint;
  $('hint').hidden = true;
  $('modal-layer').hidden = true;

  renderLives();
  show('room');

  // if the player is stuck for a while, let the hotspot glow faintly
  clearTimeout(state.teaseTimer);
  state.teaseTimer = setTimeout(() => $('hotspot').classList.add('tease'), 15000);
}

function toggleHint() {
  const hint = $('hint');
  hint.hidden = !hint.hidden;
  $('lupa').setAttribute('aria-label', hint.hidden ? 'Show hint' : 'Hide hint');
}

/* --- 4. question ---------------------------------------------------------- */

/* The modal was designed around three options of two lines each. Real
   questions have two or three options and can run much longer, so the stack
   is laid out from the design's own measurements and the type shrinks to fit
   rather than spilling out of the card. */
const STACK_TOP = 210.68;    // top of the first option, from the design
const STACK_BOTTOM = 546.85; // bottom of the last option, from the design
const OPT_GAP = 18.69;
const HEAD_MAX_H = 140;      // room for the question inside the yellow band

function fitText(el, maxSize, minSize, maxHeight, ratio) {
  let size = maxSize;
  for (;;) {
    el.style.fontSize = size + 'px';
    el.style.lineHeight = (size * ratio) + 'px';
    if (size <= minSize || el.scrollHeight <= maxHeight) return;
    size -= 1;
  }
}

function shuffled(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function openQuestion() {
  const q = state.current.question;

  // The modal must be on screen before anything is measured — a hidden
  // element reports every height as 0 and nothing would ever shrink.
  $('modal-layer').hidden = false;

  const head = $('q-text');
  head.textContent = q.text;
  fitText(head, 53.19, 30, HEAD_MAX_H, 64 / 53.19);

  const opts = SHUFFLE ? shuffled(q.options) : q.options.slice();
  const n = opts.length;
  const h = (STACK_BOTTOM - STACK_TOP - OPT_GAP * (n - 1)) / n;

  const box = $('answers');
  box.innerHTML = '';
  opts.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'answer';
    b.style.top = (STACK_TOP + i * (h + OPT_GAP)) + 'px';
    b.style.height = h + 'px';

    const label = document.createElement('span');
    label.textContent = opt.text;
    b.appendChild(label);

    b.addEventListener('click', () => answer(b, !!opt.correct));
    box.appendChild(b);
    fitText(label, 29.05, 17, h - 30, 36 / 29.05);
  });

  clearTimeout(state.teaseTimer);
}

function answer(btn, isCorrect) {
  if (isCorrect) {
    btn.classList.add('right');
    for (const b of $('answers').children) b.disabled = true;
    setTimeout(solveRoom, 800);
    return;
  }

  btn.classList.add('wrong');
  btn.disabled = true;

  if (!loseLife()) {
    setTimeout(gameOver, 700);
  }
}

function solveRoom() {
  state.solved.add(state.current.id);
  $('modal-layer').hidden = true;
  $('hint').hidden = true;

  buildWall();
  show('wall');

  // you only escape once EVERY door on the wall is gone
  const remaining = ROOMS.filter(r => !state.solved.has(r.id));
  if (remaining.length === 0) setTimeout(win, 900);
}

/* --- end states ----------------------------------------------------------- */
function gameOver() {
  $('end-title').textContent = 'out of lives';
  $('end-sub').textContent = 'The doors lock themselves again.';
  $('endcard').hidden = false;
}

function win() {
  $('end-title').textContent = 'you escaped';
  $('end-sub').textContent = 'Every door on the wall is open.';
  $('endcard').hidden = false;
}

function restart() {
  state.lives = LIVES;
  state.solved.clear();
  state.unlocked.clear();
  state.current = null;
  closeLock();
  $('endcard').hidden = true;
  $('modal-layer').hidden = true;
  $('hint').hidden = true;
  renderLives();
  buildWall();
  show('entrance');
}

/* --- music ---------------------------------------------------------------- */
/* Drop the track into assets/ and put its file name here — that is the only
   line to change. */
const MUSIC_FILE = 'assets/music.mp3';
const MUSIC_VOLUME = 0.35;   // background level: present, never in the way

const music = {
  el: null,
  on: localStorage.getItem('escapeRoomMuted') !== '1',
};

function renderSound() {
  const btn = $('sound');
  btn.classList.toggle('muted', !music.on);
  btn.setAttribute('aria-pressed', String(music.on));
  btn.setAttribute('aria-label', music.on ? 'Turn music off' : 'Turn music on');
}

/* Browsers refuse to start audio before the player has touched the page, so
   the attempt is repeated on the first click or key press anywhere. */
function tryPlay() {
  if (!music.on || !music.el) return;
  music.el.play().then(dropUnlock).catch(() => {});
}

function dropUnlock() {
  removeEventListener('pointerdown', tryPlay);
  removeEventListener('keydown', tryPlay);
}

function toggleSound() {
  music.on = !music.on;
  localStorage.setItem('escapeRoomMuted', music.on ? '0' : '1');
  renderSound();
  if (music.on) tryPlay();
  else music.el.pause();
}

function initMusic() {
  music.el = $('bgm');
  music.el.src = MUSIC_FILE;
  music.el.volume = MUSIC_VOLUME;
  renderSound();
  tryPlay();
  addEventListener('pointerdown', tryPlay);
  addEventListener('keydown', tryPlay);
}

/* --- preloading ----------------------------------------------------------- */
/* The room photos are a couple of megabytes each. Pull them down quietly while
   the player is choosing a door, so opening one is instant rather than a wait
   on a blank frame. */
function preloadRooms() {
  for (const room of ROOMS) {
    if (room.photo) new Image().src = room.photo;
  }
}

/* --- wiring --------------------------------------------------------------- */
$('enter-btn').addEventListener('click', () => { buildWall(); show('wall'); preloadRooms(); });
$('lupa').addEventListener('click', toggleHint);
$('hint-close').addEventListener('click', toggleHint);
$('hotspot').addEventListener('click', openQuestion);
$('end-btn').addEventListener('click', restart);
$('sound').addEventListener('click', toggleSound);
$('lock-go').addEventListener('click', attemptLock);
$('lock-back').addEventListener('click', closeLock);

// Esc closes whatever is on top
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('lock-layer').hidden) { closeLock(); return; }
  if (!$('modal-layer').hidden) { $('modal-layer').hidden = true; return; }
  if (!$('hint').hidden) toggleHint();
});

fitStage();
initMusic();
renderLives();
buildWall();
show('entrance');
