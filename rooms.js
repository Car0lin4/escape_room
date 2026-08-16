/* ---------------------------------------------------------------------------
   ROOM DATA  —  this is the only file you need to edit to change content.
   ---------------------------------------------------------------------------
   One entry per door on the wall, numbered in reading order (top-left ->
   bottom-right) exactly as the doors sit in the Paper file.

     photo    - the room picture, shown full-frame behind everything
     lock     - the little Ley 100 puzzle you must beat BEFORE the door opens
     hint     - text shown in the pink banner when the magnifier is clicked
     hotspot  - the invisible area you must find and click, in board
                coordinates (the board is 1280 x 832)
     question - the prompt and its options; mark the right one with `correct`

   Hotspot boxes were measured from the images in `room_hint_reference/`.
   Those reference images are NOT used by the game — they never ship.

   Options are shuffled on every play (see SHUFFLE below), so the order they
   are written in here does not give the answer away.

   ---------------------------------------------------------------------------
   THE LOCKS
   ---------------------------------------------------------------------------
   Every lock is a different kind of little machine, all of them about the
   Ley 100 de 1993. `type` picks the machine, the rest of the keys are what
   that machine needs. `hint` is only shown after two failed attempts.

     keypad    - punch a number in on a pin pad           (answer: string)
     wheels    - spin one wheel per field                 (wheels: [...])
     order     - tap the items into the right sequence    (items: in order)
     odd       - find the one word that does not belong   (items, answer)
     match     - pair each initialism with its name       (pairs: [[a, b]])
     sort      - file each item into one of two drawers   (bins, items)
     words     - tap scattered words into a phrase        (answer: [words])
     truefalse - mark every statement true or false       (items)
     pick2     - choose one option in each row            (rows)
     dials     - spin letter dials to spell a word        (answer, pools)

   Adding a new machine means adding a builder in locks.js — nothing here.
--------------------------------------------------------------------------- */

const ROOMS = [
  {
    id: 1,
    name: 'The card corridor',
    door: { img: 'assets/door-01.webp', x: 134, y: 44, w: 78, h: 118,
            size: 'cover', pos: '50%', opacity: 1 },
    lock: {
      type: 'keypad',
      title: 'The combination lock',
      prompt: '“Por la cual se crea el sistema de seguridad social integral.” ' +
              'Bogotá, 1993. Punch in the number of that ley.',
      answer: '100',
      hint: 'Three digits, and the roundest number the Congress had lying around.',
    },
    photo: 'room_photos/1.webp',
    hint: 'Look on one of the cards! Or near them.',
    hotspot: { x: 613, y: 227, w: 99, h: 100 },
    question: {
      text: 'How many and what are the four pension categories?',
      options: [
        { text: '4 types (old-age, disability, survivor, and family pensions)', correct: true },
        { text: '2 types (old-age pension and work-related accident pension)' },
        { text: '5 types (old-age, disability, survivor, family, and mental health pensions)' },
      ],
    },
  },

  {
    id: 2,
    name: 'The apothecary',
    door: { img: 'assets/door-02.webp', x: 389, y: 54, w: 114, h: 148,
            size: 'round(99.8%, 0.5px) round(100.38%, 0.5px)', pos: '50%', opacity: 1 },
    lock: {
      type: 'wheels',
      title: 'The date lock',
      prompt: 'Set the day the Congress of Colombia handed the law down.',
      wheels: [
        { label: 'day',   min: 1,    max: 31,   start: 15,   answer: 23 },
        { label: 'month', min: 1,    max: 12,   start: 6,    answer: 12, format: 'month' },
        { label: 'year',  min: 1990, max: 1996, start: 1990, answer: 1993 },
      ],
      hint: 'Two days before Christmas, in the last full year of the Gaviria reforms.',
    },
    photo: 'room_photos/2.webp',
    hint: 'Something is brewing on the counter. Check the flasks!',
    hotspot: { x: 592, y: 503, w: 100, h: 120 },
    question: {
      text: 'What are the names of the two pension systems in Colombia?',
      options: [
        { text: 'Pay-As-You-Go or Average Contribution System (RPM) and Individual Savings with Solidarity System (RAIS)', correct: true },
        { text: 'Contributory and subsidized systems' },
        { text: 'Exception system and benefits system' },
      ],
    },
  },

  {
    id: 3,
    name: 'The archive',
    door: { img: 'assets/door-03.webp', x: 644, y: 36, w: 87, h: 131,
            size: 'cover', pos: '50%', opacity: 1 },
    lock: {
      type: 'order',
      title: 'The four-bolt lock',
      prompt: 'Ley 100 is built out of four Libros. Tap them in the order the ' +
              'law lays them out, Libro I to Libro IV.',
      items: ['Pensiones', 'Salud', 'Riesgos profesionales', 'Servicios sociales complementarios'],
      hint: 'Old age first, then the doctor, then the accident at work — and the extras last.',
    },
    photo: 'room_photos/3.webp',
    hint: 'Forget the drawers. Look down, in the middle of the aisle!',
    hotspot: { x: 500, y: 500, w: 202, h: 268 },
    question: {
      text: 'What is the retirement age for an old-age pension in Colombia?',
      options: [
        { text: '62 years old (men) and 57 years old (women)', correct: true },
        { text: '69 years old (men) and 60 years old (women)' },
        { text: '59 years old (men) and 50 years old (women)' },
      ],
    },
  },

  {
    id: 4,
    name: 'The monitor wall',
    door: { img: 'assets/door-04.webp', x: 807, y: 41, w: 63, h: 102,
            size: 'round(131.75%, 0.5px) round(108.5%, 0.5px)', pos: '50% 3.85%', opacity: 1 },
    lock: {
      type: 'odd',
      title: 'The impostor lock',
      prompt: 'Article 2 names the principles the system has to obey. ' +
              'One word on this plate was never one of them — press it.',
      items: ['Eficiencia', 'Universalidad', 'Solidaridad', 'Integralidad',
              'Unidad', 'Participación', 'Rentabilidad'],
      answer: 'Rentabilidad',
      hint: 'Social security is an essential public service, not an investment. ' +
            'One of these words only cares about the return.',
    },
    photo: 'room_photos/4.webp',
    hint: "One of the screens isn't showing an empty room…",
    hotspot: { x: 394, y: 451, w: 202, h: 114 },
    question: {
      text: 'How many weeks of contributions are required to receive a disability pension?',
      options: [
        { text: '50 weeks (accumulated over 3 years)', correct: true },
        { text: '70 weeks (accumulated over 4 years)' },
        { text: '80 weeks (accumulated over 5 years)' },
      ],
    },
  },

  {
    id: 5,
    name: 'The scratched cell',
    door: { img: 'assets/door-05.webp', x: 118, y: 225, w: 126, h: 154,
            size: 'round(122.22%, 0.5px) round(100%, 0.5px)', pos: '35.71% 0%', opacity: 1 },
    lock: {
      type: 'match',
      title: 'The initials lock',
      prompt: 'Four sets of initials run the system Ley 100 built. ' +
              'Pair each one with its name.',
      pairs: [
        ['EPS', 'Entidad Promotora de Salud'],
        ['IPS', 'Institución Prestadora de Servicios de Salud'],
        ['AFP', 'Administradora de Fondos de Pensiones'],
        ['ARL', 'Administradora de Riesgos Laborales'],
      ],
      hint: 'One signs you up, one treats you, one holds your savings, ' +
            'and one covers the accident at work.',
    },
    photo: 'room_photos/5.webp',
    hint: 'Among all the scribbles, one of them is staring back!',
    hotspot: { x: 739, y: 344, w: 118, h: 115 },
    question: {
      text: 'How is the payment of the contribution distributed between the worker and the employer?',
      options: [
        { text: 'The employer must pay 75% of the total contribution, and the remaining 25% is paid by the worker.', correct: true },
        { text: 'The employer must pay 70% of the total contribution, and the worker pays the remaining 30%.' },
      ],
    },
  },

  {
    id: 6,
    name: 'The ruined chapel',
    door: { img: 'assets/door-06.webp', x: 315, y: 260, w: 148, h: 178,
            size: 'cover', pos: '50%', opacity: 1 },
    lock: {
      type: 'sort',
      title: 'The two-drawer lock',
      prompt: 'Health has two régimenes. File each affiliate in the right drawer.',
      bins: ['Contributivo', 'Subsidiado'],
      items: [
        { text: 'A worker hired under an employment contract', bin: 0 },
        { text: 'A pensioner drawing their mesada every month', bin: 0 },
        { text: 'A household with no ability to pay, found through the Sisbén', bin: 1 },
        { text: 'Indigenous communities and people living on the street', bin: 1 },
      ],
      hint: 'If you can pay the cotización, you contribute. ' +
            'If you cannot, the system subsidises you.',
    },
    photo: 'room_photos/6.webp',
    hint: 'Look up at the altar. The only window with colour left!',
    hotspot: { x: 566, y: 268, w: 120, h: 165 },
    question: {
      text: 'What is the total contribution rate to the General Pension System?',
      options: [
        { text: 'It is 13.5% of the base contribution income.', correct: true },
        { text: 'It is 10.5% of the base contribution income.' },
      ],
    },
  },

  {
    id: 7,
    name: 'The brick corridor',
    door: { img: 'assets/door-07.webp', x: 562, y: 299, w: 63, h: 95,
            size: 'round(112.57%, 0.5px) round(112.85%, 0.5px)', pos: '40.06% 56.52%', opacity: 0.76 },
    lock: {
      type: 'words',
      title: 'The word lock',
      prompt: 'Name the pension régimen where every peso you save stays in your ' +
              'own account. Tap the words in order.',
      answer: ['Régimen', 'de', 'Ahorro', 'Individual', 'con', 'Solidaridad'],
      hint: 'Its initials spell RAIS — and the S on the end is Solidaridad.',
    },
    photo: 'room_photos/7.webp',
    hint: 'Keep walking with your eyes. All the way to the end!',
    hotspot: { x: 649, y: 366, w: 143, h: 169 },
    question: {
      text: 'What is the minimum number of weeks of contributions required for the old-age pension?',
      options: [
        { text: 'A minimum of 1,300 weeks of contributions is required.', correct: true },
        { text: 'A minimum of 1,000 weeks of contributions is required.' },
      ],
    },
  },

  {
    id: 8,
    name: 'The evidence room',
    door: { img: 'assets/door-08.webp', x: 155, y: 467, w: 99, h: 202,
            size: 'round(125.61%, 0.5px) round(101.98%, 0.5px)', pos: '12.52% 100%', opacity: 1 },
    lock: {
      type: 'truefalse',
      title: 'The verdict lock',
      prompt: 'Three statements. Mark each one true or false, then throw the bolt.',
      items: [
        { text: 'Ley 100 runs to 289 articles.', answer: true },
        { text: 'For a worker on a payroll, joining the pension system is optional.', answer: false },
        { text: 'Part of every contribution helps to finance the régimen subsidiado.', answer: true },
      ],
      hint: 'Nothing about affiliation is optional — that is the whole point of ' +
            'a compulsory system.',
    },
    photo: 'room_photos/8.webp',
    hint: 'Someone on the table is looking straight at you!',
    hotspot: { x: 453, y: 555, w: 100, h: 119 },
    question: {
      text: 'Disability pension refers to:',
      options: [
        { text: 'A benefit granted when a person loses 50% of their work capacity, having completed a minimum number of contributions.', correct: true },
        { text: 'A benefit that recognizes the combined contributions of spouses, who together meet the requirements for an old-age pension.' },
      ],
    },
  },

  {
    id: 9,
    name: 'The cellar stairs',
    door: { img: 'assets/door-09.webp', x: 715, y: 404, w: 108, h: 186,
            size: 'round(105.37%, 0.5px) round(101.61%, 0.5px)', pos: '50.09% 98.96%', opacity: 1 },
    lock: {
      type: 'pick2',
      title: 'The percentage lock',
      prompt: 'In the contributory health régimen the employer and the worker ' +
              'together pay 12.5% of the base income. Dial in each share.',
      rows: [
        { label: 'Employer', options: ['4%', '6.25%', '8.5%', '12.5%'], answer: '8.5%' },
        { label: 'Worker',   options: ['1.5%', '4%', '8.5%', '10%'],    answer: '4%' },
      ],
      hint: 'The employer carries the heavier end, and the two shares have to ' +
            'add up to 12.5.',
    },
    photo: 'room_photos/9.webp',
    hint: 'At the top of the stairs, where the light gives up…',
    hotspot: { x: 563, y: 181, w: 130, h: 163 },
    question: {
      text: "Survivor's pension refers to:",
      options: [
        { text: 'A benefit granted to family members after the death of a member or retiree, seeking to ensure their economic stability.', correct: true },
        { text: 'A benefit that recognizes the combined contributions of spouses, fulfilling the requirements for an old-age pension.' },
      ],
    },
  },

  {
    id: 10,
    name: 'The red hallway',
    door: { img: 'assets/door-10.webp', x: 414, y: 594, w: 105, h: 157,
            size: 'round(100%, 0.5px) round(100.32%, 0.5px)', pos: '0% 0%', opacity: 1 },
    lock: {
      type: 'dials',
      title: 'The letter lock',
      prompt: 'Ley 100 created FOSYGA, the Fondo de Solidaridad y Garantía. ' +
              'In 2017 its money passed to a new administrator — spin the dials ' +
              'to spell it.',
      answer: 'ADRES',
      pools: ['AEIOSU', 'BDLNRT', 'CMPRSD', 'AEIOUY', 'DLNRST'],
      hint: 'Five letters, starts with A, ends with S: the entity that now pays ' +
            'the EPS on behalf of the State.',
    },
    photo: 'room_photos/10.webp',
    hint: 'On the left wall, something round is set into the tiles!',
    hotspot: { x: 173, y: 245, w: 131, h: 134 },
    question: {
      text: 'What is the main function of the Pension Solidarity Fund created by Law 100?',
      options: [
        { text: 'To subsidize contributions from vulnerable population groups.', correct: true },
        { text: 'To finance the payment of public sector pensions.' },
      ],
    },
  },
];

/* How many lives the player has for the whole game. */
const LIVES = 10;

/* The correct answer is written first in every question above. Set this to
   false if you want the options to always appear in that written order. */
const SHUFFLE = true;

/* Locks are the warm-up, so by default fumbling one is free — it only shakes
   and, after two tries, gives up its hint. Set this to true if you want a
   failed lock to cost a life just like a wrong answer does. */
const LOCK_COSTS_LIFE = false;

/* How many misses before the lock offers its hint. */
const LOCK_HINT_AFTER = 2;

/* A light wash laid over every room photo, so the pink hint banner reads. */
const ROOM_SCRIM = '#0000001F';
