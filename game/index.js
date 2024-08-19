export default 14-1;

import gg from './js/canvas/2d.js';
import machine from './js/statemachine/machine.js';

import level from './level.js';
import menu from './menu.js';

gg.emit('color', { stroke: 'Coral', fill: 'Coral', bg: 'Aqua' });

machine.add('menu', menu);
machine.add('level', level);
