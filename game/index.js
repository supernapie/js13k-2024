export default 14-1;

import gg from './js/canvas/2d.js';
import ft from './js/draw/text.js';
import machine from './js/statemachine/machine.js';

gg.emit('color', { fill: '#111214', bg: '#917865' });

let states = machine(gg);

let menu = states.add('menu');
let menuText = ft({text: 'To play: Tap!'});
menu.on('draw', menuText.draw);

let play = states.add('play');
let loseText = ft({text: 'To lose: Tap!'});
play.on('draw', loseText.draw);
play.on('stop', () => {
    menuText.text = 'To play again: Tap!';
});

gg.on('tap', () => {
    let next = states.active === 'menu' ? 'play' : 'menu';
    states.start(next);
});
