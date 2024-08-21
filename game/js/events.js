export default (obj = {}, eTypes = []) => {

    let listeners = {};

    obj.on = (type, callback) => {
        if (!listeners[type]) {
            listeners[type] = [];
        }
        listeners[type].push(callback);
    };

    obj.off = (type, callback) => {
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

    obj.once = (type, callback) => {
        let disposableCallback = e => {
            callback(e);
            obj.off(type, disposableCallback);
        };
        obj.on(type, disposableCallback);
    };

    let lastEmission = {};

    obj.emit = (type, e = {}) => {
        if (lastEmission[type]) {
            Object.assign(lastEmission[type], e);
        } else {
            lastEmission[type] = e;
        }
        if (listeners[type]) {
            listeners[type].forEach(listener => listener(e));
        }
    };

    obj.last = (type) => {
        if (!lastEmission[type]) {
            return {};
        }
        return lastEmission[type];
    };

    eTypes.forEach(eType => {
        obj[eType] = e => {
            obj.emit(eType, e);
        };
    });

    obj.syncOn = other => {
        eTypes.forEach(
        eType => other.on(eType, obj[eType]));
    };

    obj.syncOff = other => eTypes.forEach(
        eType => other.off(eType, obj[eType])
    );

    return obj;
};
