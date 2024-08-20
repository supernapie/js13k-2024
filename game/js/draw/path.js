export default (obj = {}) => {
    let ow = 0; // original width
    let oh = 0; // original height
    let defaults = {
        paths: [],
        fills: [],
        x: 0,
        y: 0,
        w: 40,
        h: 40,
        a: 0, // 0-360
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    ow = obj.w;
    oh = obj.h;
    obj.draw = e => {
        let { ctx } = e;
        let { paths, fills, x, y, w, h, a } = obj;
        let rad = a * Math.PI / 180;
        let cx = w / ow;
        let cy = h / oh;
        // transform matrix
        let m = new DOMMatrix([
            Math.cos(rad) * cx,
            Math.sin(rad) * cx,
            -Math.sin(rad) * cy,
            Math.cos(rad) * cy,
            x + w / 2,
            y + h / 2,
        ]);
        // normalize matrix, puts the origin in the center
        let n = new DOMMatrix([1, 0, 0, 1, -ow / 2, -oh / 2]);
        paths.forEach((path, i) => {
            let p = new Path2D();
            let np = new Path2D();
            np.addPath(new Path2D(path), n);
            p.addPath(np, m);
            if (fills[i]) {
                ctx.fillStyle = fills[i];
            }
            ctx.fill(p);
        });
    };
    return obj;
};
