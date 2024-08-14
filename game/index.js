export default 14-1;

import gg from './js/canvas/2d.js';
import machine from './js/statemachine/machine.js';

import level from './level.js';
import menu from './menu.js';

gg.emit('color', { stroke: 'Seashell', fill: 'Seashell', bg: 'SeaGreen' });

let screens = machine(gg);
screens.add('menu', menu);
screens.add('level', level);
screens.start('menu');
