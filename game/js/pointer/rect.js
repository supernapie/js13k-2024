import css from '../css.js';
css`body.p canvas{cursor:pointer;}`;

import events from '../events.js';

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        w: 40,
        h: 40
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    let {on, off, once, emit, last} = events();
    obj.pointer = {
        on,
        off,
        once,
        emit,
        last,
        down: false,
        pointing: false
    };
    window.addEventListener('pointerdown', e => {
        let { clientX: x, clientY: y } = e;
        if (x > obj.x &&
            x < obj.x + obj.w &&
            y > obj.y &&
            y < obj.y + obj.h
        ) {
            emit('down', {x, y});
            obj.pointer.down = true;
        }
    });
    window.addEventListener('pointerup', e => {
        let { clientX: x, clientY: y } = e;
        if (x > obj.x &&
            x < obj.x + obj.w &&
            y > obj.y &&
            y < obj.y + obj.h
        ) {
            emit('tap', {x, y});
            emit('up', {x, y});
        }
        obj.pointer.down = false;
    });
    window.addEventListener('pointermove', e => {
        let { clientX: x, clientY: y } = e;
        if (x > obj.x &&
            x < obj.x + obj.w &&
            y > obj.y &&
            y < obj.y + obj.h
        ) {
            if (!obj.pointer.pointing) {
                emit('startpointing', {x, y});
                document.body.classList.add('p');
            }
            emit('move', {x, y});
            obj.pointer.pointing = true;
        } else {
            if (obj.pointer.pointing) {
                emit('stoppointing', {x, y});
                document.body.classList.remove('p');
            }
            obj.pointer.pointing = false;
        }
    });
    return obj;
};
