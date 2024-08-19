import path from './js/draw/path.js';

let d = 'M28,10C23.46,7.85,11.54,4.43,8,8c-4.22,4.26-4.85,20.46,0,24c4.06,2.96,15.7,0.6,20-2c3.03-1.83,10-7.99,10-10 S31.19,11.51,28,10z M14,29.04V10.74c1.13-0.23,2.54-0.19,4,0.01v18.39C16.55,29.29,15.16,29.27,14,29.04z M25.94,26.9 c-0.51,0.31-1.18,0.61-1.94,0.89V12.26c0.75,0.27,1.42,0.54,1.94,0.79c0.56,0.27,1.29,0.76,2.06,1.36V25.4 C27.22,26.04,26.49,26.57,25.94,26.9z';

export default (options = {}) => {
    let defaults = {
        paths: [d],
        x: 0,
        y: 0,
        w: 40,
        h: 40,
        a: 0,
        fills: ['Coral'],
        gx: 0,
        gy: 0
    };
    Object.assign(defaults, options);
    Object.assign(options, defaults);
    let boat = path(options);
    return boat;
};
