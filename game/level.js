import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';

let level = state();

level.on('start', () => {
    level.once('tap', () => {
        level.machine.start('menu');
    });
});

let loseText = ft({text: 'To lose: Tap!'});
level.on('draw', loseText.draw);

export default level;
