import events from '../events.js';
export default () => {
    let active = false;
    let state = {
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
    events(state, ['start', 'stop']);
    return state;
};
