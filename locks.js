/* ---------------------------------------------------------------------------
   Escape Room — door locks

   Every door on the wall is locked. Clicking one raises a small puzzle about
   the Ley 100 de 1993; beat it and the door opens into its room.

   One builder per kind of lock. A builder gets the room's `lock` config and
   the empty body element, fills the body, and hands back:

     footer   - true if the lock needs the "unlock" button at the bottom
                (false when the machine decides for itself when to be judged)
     correct  - () => boolean, asked every time the lock is tried
     reset    - () => void, called after a miss to clear the machine

   The builders call attemptLock() themselves whenever the player has finished
   an input — that is what makes a pin pad feel like a pin pad.
--------------------------------------------------------------------------- */

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const lockUI = {
  room: null,      // room whose lock is on screen
  misses: 0,
  widget: null,    // whatever the builder handed back
  onSolved: null,
};

/* --- little helpers -------------------------------------------------------- */
function lockEl(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

/* the ▲ value ▼ column used by both the date wheels and the letter dials */
function spinner(caption, render, step) {
  const col = lockEl('div', 'wheel');
  const up = lockEl('button', 'wheel-btn', '▲');
  const val = lockEl('div', 'wheel-val');
  const down = lockEl('button', 'wheel-btn', '▼');
  const paint = () => { val.textContent = render(); };

  up.addEventListener('click', () => { step(1); paint(); });
  down.addEventListener('click', () => { step(-1); paint(); });

  col.append(up, val, down);
  if (caption) col.appendChild(lockEl('div', 'wheel-cap', caption));
  paint();
  return col;
}

/* --- the machines ---------------------------------------------------------- */
const LOCK_BUILDERS = {

  /* punch a number in, ✓ tries the lock */
  keypad(cfg, root) {
    let typed = '';
    const screen = lockEl('div', 'kp-screen');

    const paint = () => {
      screen.innerHTML = '';
      for (let i = 0; i < cfg.answer.length; i++) {
        const slot = lockEl('span', 'kp-slot', typed[i] || '');
        if (typed[i]) slot.classList.add('filled');
        screen.appendChild(slot);
      }
    };

    const pad = lockEl('div', 'kp-pad');
    for (const key of ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'go']) {
      const face = key === 'del' ? '⌫' : key === 'go' ? '✓' : key;
      const b = lockEl('button', 'kp-key' + (key === 'go' ? ' kp-go' : ''), face);
      b.addEventListener('click', () => {
        if (key === 'go') return attemptLock();
        if (key === 'del') typed = typed.slice(0, -1);
        else if (typed.length < cfg.answer.length) typed += key;
        paint();
      });
      pad.appendChild(b);
    }

    root.append(screen, pad);
    paint();

    return {
      footer: false,
      correct: () => typed === cfg.answer,
      reset: () => { typed = ''; paint(); },
    };
  },

  /* one spinning wheel per field — day / month / year */
  wheels(cfg, root) {
    const at = cfg.wheels.map(w => w.start);
    const row = lockEl('div', 'wheels');

    cfg.wheels.forEach((w, i) => {
      const span = w.max - w.min + 1;
      row.appendChild(spinner(
        w.label,
        () => (w.format === 'month' ? MONTHS[at[i] - 1] : at[i]),
        (d) => { at[i] = w.min + (((at[i] - w.min + d) % span) + span) % span; },
      ));
    });

    root.appendChild(row);

    return {
      footer: true,
      correct: () => cfg.wheels.every((w, i) => at[i] === w.answer),
      reset: () => {},
    };
  },

  /* tap the items into the right sequence; tapping one again takes it back */
  order(cfg, root) {
    const picked = [];
    const list = lockEl('div', 'stack');

    const rows = shuffled(cfg.items).map(text => {
      const row = lockEl('button', 'row');
      row.append(lockEl('span', 'row-badge'), lockEl('span', 'row-label', text));
      row.dataset.text = text;
      row.addEventListener('click', () => {
        const seat = picked.indexOf(text);
        if (seat === -1) picked.push(text); else picked.splice(seat, 1);
        paint();
        if (picked.length === cfg.items.length) setTimeout(attemptLock, 260);
      });
      list.appendChild(row);
      return row;
    });

    function paint() {
      for (const row of rows) {
        const seat = picked.indexOf(row.dataset.text);
        row.classList.toggle('picked', seat !== -1);
        row.firstChild.textContent = seat === -1 ? '' : ROMAN[seat];
      }
    }

    root.appendChild(list);
    paint();

    return {
      footer: false,
      correct: () => picked.length === cfg.items.length &&
                     picked.every((t, i) => t === cfg.items[i]),
      reset: () => { picked.length = 0; paint(); },
    };
  },

  /* find the one word that was never in the article */
  odd(cfg, root) {
    let hit = null;
    const bank = lockEl('div', 'chips');

    for (const text of shuffled(cfg.items)) {
      const chip = lockEl('button', 'chip', text);
      chip.addEventListener('click', () => {
        hit = text;
        chip.classList.add(text === cfg.answer ? 'good' : 'bad');
        attemptLock();
      });
      bank.appendChild(chip);
    }

    root.appendChild(bank);

    return {
      footer: false,
      correct: () => hit === cfg.answer,
      reset: () => {
        hit = null;
        for (const chip of bank.children) chip.classList.remove('bad');
      },
    };
  },

  /* click an initialism, then its name — right pairs stay lit */
  match(cfg, root) {
    const mate = Object.fromEntries(cfg.pairs);
    const done = new Set();
    let picked = null;

    const grid = lockEl('div', 'match');
    const keys = lockEl('div', 'match-col');
    const names = lockEl('div', 'match-col match-names');

    const clear = () => {
      picked = null;
      for (const chip of keys.children) chip.classList.remove('on');
    };

    for (const key of shuffled(cfg.pairs.map(p => p[0]))) {
      const chip = lockEl('button', 'chip chip-key', key);
      chip.addEventListener('click', () => {
        if (done.has(key)) return;
        clear();
        picked = { key, chip };
        chip.classList.add('on');
      });
      keys.appendChild(chip);
    }

    for (const name of shuffled(cfg.pairs.map(p => p[1]))) {
      const chip = lockEl('button', 'chip chip-name', name);
      chip.addEventListener('click', () => {
        if (!picked || chip.classList.contains('good')) return;
        if (mate[picked.key] === name) {
          picked.chip.classList.remove('on');
          picked.chip.classList.add('good');
          chip.classList.add('good');
          done.add(picked.key);
          picked = null;
          if (done.size === cfg.pairs.length) setTimeout(attemptLock, 260);
        } else {
          chip.classList.add('bad');
          setTimeout(() => chip.classList.remove('bad'), 500);
          attemptLock();          // a wrong pairing counts as a miss
        }
      });
      names.appendChild(chip);
    }

    grid.append(keys, names);
    root.appendChild(grid);

    return {
      footer: false,
      correct: () => done.size === cfg.pairs.length,
      reset: clear,               // never wipes the pairs already found
    };
  },

  /* file every item into one of two drawers */
  sort(cfg, root) {
    const choice = cfg.items.map(() => -1);
    const list = lockEl('div', 'stack');

    cfg.items.forEach((item, i) => {
      const row = lockEl('div', 'sort-row');
      const opts = lockEl('span', 'sort-opts');

      cfg.bins.forEach((bin, b) => {
        const pill = lockEl('button', 'pill', bin);
        pill.addEventListener('click', () => {
          choice[i] = b;
          for (const other of opts.children) other.classList.remove('on');
          pill.classList.add('on');
        });
        opts.appendChild(pill);
      });

      row.append(lockEl('span', 'sort-label', item.text), opts);
      list.appendChild(row);
    });

    root.appendChild(list);

    return {
      footer: true,
      correct: () => cfg.items.every((item, i) => choice[i] === item.bin),
      reset: () => {},            // leave the answers up so they can be edited
    };
  },

  /* three statements, true or false — same machine as the drawers */
  truefalse(cfg, root) {
    return LOCK_BUILDERS.sort({
      bins: ['true', 'false'],
      items: cfg.items.map(i => ({ text: i.text, bin: i.answer ? 0 : 1 })),
    }, root);
  },

  /* one answer per row, picked from that row's own options */
  pick2(cfg, root) {
    const choice = cfg.rows.map(() => null);
    const list = lockEl('div', 'stack');

    cfg.rows.forEach((row, i) => {
      const line = lockEl('div', 'sort-row');
      const opts = lockEl('span', 'sort-opts');

      for (const option of row.options) {
        const pill = lockEl('button', 'pill', option);
        pill.addEventListener('click', () => {
          choice[i] = option;
          for (const other of opts.children) other.classList.remove('on');
          pill.classList.add('on');
        });
        opts.appendChild(pill);
      }

      line.append(lockEl('span', 'sort-label', row.label), opts);
      list.appendChild(line);
    });

    root.appendChild(list);

    return {
      footer: true,
      correct: () => cfg.rows.every((row, i) => choice[i] === row.answer),
      reset: () => {},
    };
  },

  /* tap the scattered words into a phrase */
  words(cfg, root) {
    const picked = [];
    const line = lockEl('div', 'wordline');
    const bank = lockEl('div', 'chips');

    const chips = shuffled(cfg.answer).map(word => {
      const chip = lockEl('button', 'chip', word);
      chip.addEventListener('click', () => {
        if (picked.includes(chip)) return;
        picked.push(chip);
        paint();
        if (picked.length === cfg.answer.length) setTimeout(attemptLock, 260);
      });
      bank.appendChild(chip);
      return chip;
    });

    function paint() {
      line.innerHTML = '';
      for (const chip of chips) chip.classList.toggle('taken', picked.includes(chip));
      picked.forEach((chip, i) => {
        const word = lockEl('button', 'chip chip-word', chip.textContent);
        word.addEventListener('click', () => { picked.splice(i, 1); paint(); });
        line.appendChild(word);
      });
      if (!picked.length) line.appendChild(lockEl('span', 'wordline-ghost', '…'));
    }

    root.append(line, bank);
    paint();

    return {
      footer: false,
      correct: () => picked.length === cfg.answer.length &&
                     picked.every((chip, i) => chip.textContent === cfg.answer[i]),
      reset: () => { picked.length = 0; paint(); },
    };
  },

  /* spin one letter dial per character */
  dials(cfg, root) {
    const pools = cfg.pools.map(p => shuffled(p.split('')));
    const at = pools.map(p => Math.floor(Math.random() * p.length));
    const row = lockEl('div', 'wheels');

    pools.forEach((pool, i) => {
      row.appendChild(spinner(
        null,
        () => pool[at[i]],
        (d) => { at[i] = (at[i] + d + pool.length) % pool.length; },
      ));
    });

    root.appendChild(row);

    return {
      footer: true,
      correct: () => pools.map((pool, i) => pool[at[i]]).join('') === cfg.answer,
      reset: () => {},
    };
  },
};

/* --- opening, trying and closing a lock ------------------------------------ */
function openLock(room, onSolved) {
  const cfg = room.lock;
  lockUI.room = room;
  lockUI.onSolved = onSolved;
  lockUI.misses = 0;

  $('lock-eyebrow').textContent = `door ${room.id} · locked`;
  $('lock-title').textContent = cfg.title;
  $('lock-prompt').textContent = cfg.prompt;
  lockNote('', '');

  const body = $('lock-body');
  body.innerHTML = '';
  body.className = 'lock-body lock-' + cfg.type;
  lockUI.widget = LOCK_BUILDERS[cfg.type](cfg, body);

  const go = $('lock-go');
  go.hidden = !lockUI.widget.footer;
  go.disabled = false;

  $('lock-plate').classList.remove('open');
  $('lock-layer').hidden = false;
}

function lockNote(msg, kind) {
  const note = $('lock-note');
  note.textContent = msg;
  note.className = 'lock-note' + (kind ? ' ' + kind : '');
}

function attemptLock() {
  if (!lockUI.widget) return;
  if (lockUI.widget.correct()) lockOpens();
  else lockRefuses();
}

function lockOpens() {
  const plate = $('lock-plate');
  plate.classList.add('open');
  $('lock-go').disabled = true;
  lockNote('the bolt slides back…', 'good');

  setTimeout(() => {
    const done = lockUI.onSolved;
    closeLock();
    if (done) done();
  }, 950);
}

function lockRefuses() {
  lockUI.misses++;

  const plate = $('lock-plate');
  plate.classList.remove('shaking');
  void plate.offsetWidth;              // restart the animation
  plate.classList.add('shaking');

  if (LOCK_COSTS_LIFE && !loseLife()) {
    closeLock();
    setTimeout(gameOver, 500);
    return;
  }

  const spent = lockUI.misses >= LOCK_HINT_AFTER;
  lockNote(spent ? lockUI.room.lock.hint : 'the lock does not budge.',
           spent ? 'tip' : 'bad');

  setTimeout(() => lockUI.widget && lockUI.widget.reset(), 480);
}

function closeLock() {
  $('lock-layer').hidden = true;
  $('lock-plate').classList.remove('open', 'shaking');
  lockUI.widget = null;
  lockUI.room = null;
  lockUI.onSolved = null;
}
