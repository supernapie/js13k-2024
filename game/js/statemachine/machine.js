import canvas from '../canvas/2d.js';
import createState from './state.js';

let eTypes = ['tap', 'resize', 'step', 'draw'];
let oTypes = ['color'];

let states = {};

let add = (name, state) => {
    if (!name){
        return;
    }
    if (!state) {
        state = createState();
    }
    eTypes.forEach(eType => {
        state[eType] = e => {
            state.emit(eType, e);
        };
    });
    oTypes.forEach(oType => {
        canvas[oType] = e => {
            canvas.emit(oType, e);
        };
    });
    states[name] = state;
    if (Object.keys(states).length === 1) {
        start(name);
    }
    state.on('stop', start);
    return states[name];
};

let start = (name) => {
    if (!name || !states[name]){
        return;
    }
    Object.values(states).forEach((s) => {
        if (s.active) {
            s.active = false;
            eTypes.forEach(eType => {
                canvas.off(eType, s[eType]);
            });
            oTypes.forEach(oType => {
                s.off(oType, canvas[oType]);
            });
        }
    });
    let n = states[name];
    eTypes.forEach(eType => {
        canvas.on(eType, n[eType]);
    });
    oTypes.forEach(oType => {
        n.on(oType, canvas[oType]);
    });
    n['resize'](canvas.last('resize'));
    n.active = true;
};

export default { add, start };
