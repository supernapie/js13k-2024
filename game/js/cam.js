export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        offset: {x: 0, y: 0},
        target: {x: 0, y: 0},
        cx: 0,
        cy: 0,
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.resize = e => {
        let {vw, vh} = e;
        obj.offset.x = Math.floor(vw / 2);
        obj.offset.y = Math.floor(vh / 2);
    };
    obj.start = e => {
        obj.resize(e);
        obj.x = obj.offset.x;
        obj.y = obj.offset.y;
        obj.target.x = obj.x;
        obj.target.y = obj.y;
        obj.cx = Math.floor(obj.x - obj.offset.x);
        obj.cy = Math.floor(obj.y - obj.offset.y);
    };
    obj.step = e => {
        let {dt} = e;
        let {x, y, target} = obj;
        let dx = target.x - x;
        let dy = target.y - y;
        let speed = 0.005 * dt;
        obj.x += dx * speed;
        obj.y += dy * speed;
        obj.cx = Math.floor(obj.x - obj.offset.x);
        obj.cy = Math.floor(obj.y - obj.offset.y);
    };
    return obj;
};
