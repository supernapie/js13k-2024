import css from '../css.js';
css`body{margin:0;padding:0;overflow:hidden;}canvas{display:block;touch-action:none;user-select:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;}`;

import events from '../events.js';
let {on, off, once, emit, last} = events();

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.addEventListener('touchstart', e => e.preventDefault());

on('resize', e => {
    let { vw, vh, vc } = e;
    canvas.width = vw * vc;
    canvas.height = vh * vc;
    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
});
let windowResized = () => emit('resize', {
    vw: window.innerWidth,
    vh: window.innerHeight,
    vc: window.devicePixelRatio || 1
});
window.addEventListener('resize', windowResized);
windowResized();

on('color', e => {
    let {fill, stroke} = e;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
});
emit('color', { bg: 'black', fill: 'white', stroke: 'white' });

on('clear', () => {
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
});

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
    emit('clear');
    emit('draw', {ctx});
    requestAnimationFrame(onF);
};
requestAnimationFrame(onF);

export default { on, off, once, emit, last };
