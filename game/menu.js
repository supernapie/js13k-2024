import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';

let menu = state();

menu.on('start', () => {
    menu.once('tap', () => {
        menu.machine.start('level');
    });
});

let menuText = ft({text: 'Place Seashells around\nThe Tridecomino Coral Reef.\nTo play: Tap!'});
menu.on('draw', menuText.draw);

export default menu;
