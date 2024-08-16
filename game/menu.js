import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';

let menu = state();

menu.on('start', () => {
    menu.once('tap', () => {
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

Tap anywhere to start...`;

let menuText = ft({text: intro});
menu.on('draw', menuText.draw);

export default menu;
