import events from '../events.js';
export default () => {
    let active = false;
    let {on, off, once, emit, last} = events();
    let state = {
        on, off, once, emit, last,
        get active() {
            return active;
        },
        set active(value) {
            active = value;
            if (active) {
                state.start();
            } else {
                state.stop();
            }
        }
    };
    let eTypes = ['start', 'stop'];
    eTypes.forEach(eType => {
        state[eType] = e => {
            state.emit(eType, e);
        };
    });
    return state;
};
