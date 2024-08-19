import machine from './js/statemachine/machine.js';

import menu from './menu.js';
import level from './level.js';

machine.add('menu', menu);
machine.add('level', level);

export default machine;
