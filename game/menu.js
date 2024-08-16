import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';
import d from './d.js';
import path from './js/draw/path.js';
import tappable from './js/pointer/rect.js';

console.log(d);

let menu = state();

let boat = path({paths: [d.b], x: 0, y: 0, fills: ['Coral'], w: 40, h: 40});
tappable(boat);

menu.on('start', () => {
    boat.pointer.once('tap', () => {
        menu.machine.start('level');
    });
});

let intro = `
The Tridecomino Coral Reef.
This mysterious reef is constantly
changing, but somehow the shape is
always a polyomino of 13 squares.

The many tourist boats are damaging
the reef. It is your job to chase
them away by gently tapping on them.

Boats can only move back and forth.
Red boats are above the reef.
White boats are not above the reef.

If there are no red boats left,
the reef is safe.

Good luck!

Tap on the boat to start...`;

let menuText = ft({text: intro});
menu.on('draw', e => {
menuText.draw(e);
boat.x = menuText.x;
boat.y = menuText.h + 40;
boat.draw(e);
});

export default menu;
