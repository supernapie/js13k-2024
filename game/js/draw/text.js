export default (obj = {}) => {
    let defaults = {
        text: '',
        x: 16,
        y: 16,
        font: '16px sans-serif',
        lineHeight: 1.5,
        w: 0,
        h: 24
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.draw = e => {
        let { ctx } = e;
        let { text, x, y, font, lineHeight } = obj;
        ctx.font = font;
        ctx.textBaseline = 'top';
        let fontSize = font.match(/\d+/g);
        fontSize = fontSize ? fontSize[0] : 16;
        fontSize = Number(fontSize);
        let lines = text.split('\n');
        obj.h = lines.length * fontSize * lineHeight;
        obj.w = 0;
        lines.forEach((line, i) => {
            let w = ctx.measureText(line).width;
            ctx.fillText(line, x, y + i * fontSize * lineHeight + fontSize * (lineHeight - 1) / 2);
            obj.w = Math.max(obj.w, w);
        });
    };
    return obj;
};
