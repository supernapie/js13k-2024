import css from '../css.js';
css`body.p canvas{cursor:pointer;}`;

import events from '../events.js';

export default (options = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        w: 40,
        h: 40
    };
    Object.assign(defaults, options);
    Object.assign(options, defaults);
    let {on, off, once, emit, last} = events();
    options.pointer = {
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
        if (x > options.x &&
            x < options.x + options.w &&
            y > options.y &&
            y < options.y + options.h
        ) {
            emit('down', {x, y});
            options.pointer.down = true;
        }
    });
    window.addEventListener('pointerup', e => {
        let { clientX: x, clientY: y } = e;
        if (x > options.x &&
            x < options.x + options.w &&
            y > options.y &&
            y < options.y + options.h
        ) {
            emit('tap', {x, y});
            emit('up', {x, y});
        }
        options.pointer.down = false;
    });
    window.addEventListener('pointermove', e => {
        let { clientX: x, clientY: y } = e;
        if (x > options.x &&
            x < options.x + options.w &&
            y > options.y &&
            y < options.y + options.h
        ) {
            if (!options.pointer.pointing) {
                emit('startpointing', {x, y});
                document.body.classList.add('p');
            }
            emit('move', {x, y});
            options.pointer.pointing = true;
        } else {
            if (options.pointer.pointing) {
                emit('stoppointing', {x, y});
                document.body.classList.remove('p');
            }
            options.pointer.pointing = false;
        }
    });
    return options;
};
