export default () => {

    let listeners = {};

    let on = (type, callback) => {
        if (!listeners[type]) {
            listeners[type] = [];
        }
        listeners[type].push(callback);
    };

    let off = (type, callback) => {
        if (!type && !callback) {
            listeners = {};
            return;
        }
        if (type && !callback) {
            listeners[type] = [];
            return;
        }
        if (!type && callback) {
            for (let t in listeners) {
                listeners[t] = listeners[t].filter(listener => listener !== callback);
            }
            return;
        }
        if (listeners[type]) {
            listeners[type] = listeners[type].filter(listener => listener !== callback);
        }
    };

    let once = (type, callback) => {
        let disposableCallback = e => {
            callback(e);
            off(type, disposableCallback);
        };
        on(type, disposableCallback);
    };

    let lastEmission = {};

    let emit = (type, e = {}) => {
        if (lastEmission[type]) {
            Object.assign(lastEmission[type], e);
        } else {
            lastEmission[type] = e;
        }
        if (listeners[type]) {
            listeners[type].forEach(listener => listener(e));
        }
    };

    let last = (type) => {
        if (!lastEmission[type]) {
            return {};
        }
        return lastEmission[type];
    };

    return {on, off, once, emit, last};
};
