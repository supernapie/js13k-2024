export default (gg) => {
    let machine = {
        states: {}
    };
    machine.add = (name, state) => {
        if (!name || !state){
            return;
        }
        state.machine = machine;
        gg.eTypes.forEach(eType => {
            state[eType] = e => {
                state.emit(eType, e);
            };
        });
        gg.oTypes.forEach(oType => {
            state.on(oType, gg[oType]);
        });
        machine.states[name] = state;
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
                s.active = false;
                gg.eTypes.forEach(eType => {
                    gg.off(eType, s[eType]);
                });
            }
        });
        let n = machine.states[name];
        n.active = true;
        gg.eTypes.forEach(eType => {
            gg.on(eType, n[eType]);
        });
        n['resize'](gg.last('resize'));
    };
    machine.restart = (name) => {
        if (!name || !machine.states[name]){
            return;
        }
        let n = machine.states[name];
        if (!n.active) {
            return;
        }
        n.active = false;
        n.active = true;
    }
    return machine;
};
