import canvas from '../canvas/2d.js';
import createState from './state.js';

let states = {};

let add = (name, state) => {
    if (!name){
        return;
    }
    if (!state) {
        state = createState();
    }
    canvas.eTypes.forEach(eType => {
        state[eType] = e => {
            state.emit(eType, e);
        };
    });
    canvas.oTypes.forEach(oType => {
        state.on(oType, canvas[oType]);
    });
    states[name] = state;
    if (Object.keys(states).length === 1) {
        start(name);
    }
    return states[name];
};

let start = (name) => {
    if (!name || !states[name]){
        return;
    }
    Object.values(states).forEach((s) => {
        if (s.active) {
            s.active = false;
            canvas.eTypes.forEach(eType => {
                canvas.off(eType, s[eType]);
            });
        }
    });
    let n = states[name];
    canvas.eTypes.forEach(eType => {
        canvas.on(eType, n[eType]);
    });
    n['resize'](canvas.last('resize'));
    n.active = true;
};

export default { add, start };
