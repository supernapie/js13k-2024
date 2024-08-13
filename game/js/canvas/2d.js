import events from '../events.js';
let {on, off, once, emit, last} = events();

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.addEventListener('touchstart', e => e.preventDefault());

let resize = e => {
    let { vw, vh, vc } = e;
    canvas.width = vw * vc;
    canvas.height = vh * vc;
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
};
on('resize', resize);
window.addEventListener('resize', () => {
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let vc = window.devicePixelRatio;
    emit('resize', {vw, vh, vc});
});
emit('resize', {
    vw: window.innerWidth,
    vh: window.innerHeight,
    vc: window.devicePixelRatio || 1
});

let color = e => {
    let {fill, stroke} = e;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
};
on('color', color);
emit('color', { bg: 'black', fill: 'white', stroke: 'white' });

let clear = e => {
    let {ctx} = e;

    ctx.restore();
    ctx.save();

    let {
        vw = 320,
        vh = 320,
        vc: scale = 1
    } = last('resize');

    ctx.scale(scale, scale);

    let {
        bg = 'black',
        fill = 'white',
        stroke = 'white'
    } = last('color');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, vw, vh);

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
};
on('clear', clear);

window.addEventListener('pointerup', e => {
    let { clientX: x, clientY: y } = e;
    emit('tap', {x, y});
});

let t = 0;
let dt = 17;
let onF = time => {
    dt = time - t;
    t = time;
    emit('step', {t, dt});
    emit('clear', {ctx});
    emit('draw', {ctx});
    requestAnimationFrame(onF);
};
requestAnimationFrame(onF);

export default { on, off, once, emit, last };
