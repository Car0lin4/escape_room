# Escape Room

A point-and-click question game built from the Paper file *Refined orchard*.
All artwork is exported from that file, so the game matches the design 1:1.

## Run it

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765>. (It must be served over http — opening
`index.html` directly from the file system will not load the images.)

## Flow

1. **Entrance** — click the doorway between the red curtains.
2. **Door wall** — 10 doors. Click one to enter its room.
3. **Room** — click the **magnifier** (top left) to open/close the hint.
   Somewhere in the photo there is an invisible hotspot; click it to reveal
   the question.
4. **Question** — three options.
   - correct → back to the wall, and that door burns away into an empty frame
   - wrong → the option is struck out and you lose a life

Lives (10) are shared across the **whole game**, not per room. Run out and you
get the game-over card. Clear every door and you escape.

## Door numbering

Doors are numbered in reading order, top-left to bottom-right:

| # | where on the wall | door picture | room behind it |
|---|---|---|---|
| 1 | top left | dark arched door with steps | the card corridor |
| 2 | top, left of centre | cream stone arch, carved wooden door | the apothecary |
| 3 | top, right of centre | stone railway tunnel | the archive |
| 4 | top right | pink weathered door | the monitor wall |
| 5 | upper left | red-lit corridor | the scratched cell |
| 6 | centre left | chained hospital door | the ruined chapel |
| 7 | centre | small dark double door | the brick corridor |
| 8 | lower left | grey weathered plank door | the evidence room |
| 9 | lower right | metal door with a barred window | the cellar stairs |
| 10 | bottom centre | gothic arch with candles | the red hallway |

## Editing the content

Everything content-related lives in **`rooms.js`** — one entry per door:

```js
{
  id: 2,
  name: 'The apothecary',
  door: { /* measured from the design — leave it alone */ },

  photo: 'room_photos/2.png',                 // the room picture
  hint: 'Text for the pink banner.',
  hotspot: { x: 592, y: 503, w: 100, h: 120 },// what you must find and click
  question: {
    text: 'The question?',
    options: [
      { text: 'the right one', correct: true },
      { text: 'a wrong one' },
      { text: 'another wrong one' },          // two or three options both work
    ],
  },
}
```

Notes:

- **Hotspot coordinates** are in board space (1280 × 832) and were measured
  from the marker boxes in `room_hint_reference/`.
- **Two or three options** are both supported — the option buttons are sized
  to fill the same space either way.
- **Long text shrinks to fit.** Questions and options keep the design's type
  size when they fit and step down only as far as needed, so nothing spills
  out of the card.
- **Options are shuffled on every play.** The correct answer is written first
  in `rooms.js` for readability; set `SHUFFLE = false` to keep that order.
- `LIVES` sets how many wrong answers the player gets **for the whole game**.

## Files

| file | what it holds |
|---|---|
| `index.html` | the screens |
| `styles.css` | all layout and styling, in the design's coordinate space |
| `game.js` | game flow: screens, hint, question, lives, win/lose |
| `rooms.js` | **the content** — one entry per door |
| `room_photos/` | the ten room pictures, used by the game |
| `assets/` | entrance, door wall, door cut-outs and magnifier, from Paper |
| `room_hint_reference/` | **reference only** — marks where each hotspot goes. Not used by the game; safe to leave out when publishing. |
