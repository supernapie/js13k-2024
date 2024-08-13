import events from '../events.js';
export default () => {
    let {on, off, once, emit, last} = events();
    let state = {on, off, once, emit, last};
    state.active = false;
    state.start = () => {
        state.active = true;
        state.emit('start', {});
    };
    state.stop = () => {
        state.active = false;
        state.emit('stop', {});
    };
    state.step = (e) => {
        state.emit('step', e);
    };
    state.draw = (e) => {
        state.emit('draw', e);
    };
    return state;
};
