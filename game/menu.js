import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';

let menu = state();

menu.on('start', () => {
    menu.once('tap', () => {
        menu.machine.start('level');
    });
});

let menuText = ft({text: 'To play: Tap!'});
menu.on('draw', menuText.draw);

export default menu;
