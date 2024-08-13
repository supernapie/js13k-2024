import state from './state.js';
export default (gg) => {
    let machine = {
        states: {},
        active: ""
    };
    machine.add = (name) => {
        if (!name) {
            return;
        }
        if (machine.states[name]) {
            return machine.states[name];
        }
        machine.states[name] = state();
        if (Object.keys(machine.states).length === 1) {
            machine.start(name);
        }
        return machine.states[name];
    };
    machine.start = (name) => {
        if (!name || !machine.states[name]){
            return;
        }
        if (machine.states[name].active) {
            return;
        }
        Object.values(machine.states).forEach((s) => {
            if (s.active) {
                s.stop();
                if (gg) {
                    gg.off('step', s.step);
                    gg.off('draw', s.draw);
                }
            }
        });
        machine.states[name].start();
        machine.active = name;
        if (gg) {
            gg.on('step', machine.states[name].step);
            gg.on('draw', machine.states[name].draw);
        }
    };
    machine.restart = (name) => {
        if (!name || !machine.states[name]){
            return;
        }
        if (!machine.states[name].active) {
            return;
        }
        machine.states[name].stop();
        machine.states[name].start();
    }
    return machine;
};
