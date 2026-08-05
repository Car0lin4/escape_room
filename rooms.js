/* ---------------------------------------------------------------------------
   ROOM DATA  —  this is the only file you need to edit to change content.
   ---------------------------------------------------------------------------
   One entry per door on the wall, numbered in reading order (top-left ->
   bottom-right) exactly as the doors sit in the Paper file.

     photo    - the room picture, shown full-frame behind everything
     hint     - text shown in the pink banner when the magnifier is clicked
     hotspot  - the invisible area you must find and click, in board
                coordinates (the board is 1280 x 832)
     question - the prompt and its options; mark the right one with `correct`

   Hotspot boxes were measured from the images in `room_hint_reference/`.
   Those reference images are NOT used by the game — they never ship.

   Options are shuffled on every play (see SHUFFLE below), so the order they
   are written in here does not give the answer away.
--------------------------------------------------------------------------- */

const ROOMS = [
  {
    id: 1,
    name: 'The card corridor',
    door: { img: 'assets/door-01.webp', x: 134, y: 44, w: 78, h: 118,
            size: 'cover', pos: '50%', opacity: 1 },
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

/* A light wash laid over every room photo, so the pink hint banner reads. */
const ROOM_SCRIM = '#0000001F';
