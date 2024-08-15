import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';

let level = state();

// a grid
let nRows = 14;
let nCols = 14;
let grid = Array(nRows).fill(0).map(() => Array(nCols).fill(0));

let textTiles = grid.map((row, y) => row.map((value, x) => ft({text: String(value), x: x * 40, y: y * 40})));

let cam = {
    x: 0, y: 0,
    offset: {x: 0, y: 0},
    target: {x: 0, y: 0}
};

level.on('start', () => {

    let {vw, vh} = level.last('resize');
    cam.offset.x = -Math.floor(vw / 2);
    cam.offset.y = -Math.floor(vh / 2);
    cam.x = -cam.offset.x;
    cam.y = -cam.offset.y;
    cam.target.x = cam.x;
    cam.target.y = cam.y;

    nRows = 14;
    nCols = 14;

    // Reset all to 0
    grid = Array(nRows).fill(0).map(() => Array(nCols).fill(0));

    // Add one number 13 to the grid in a random position
    let position = {
        x: Math.floor(Math.random() * nCols),
        y: Math.floor(Math.random() * nRows)
    };
    grid[position.y][position.x] = 13;

    // Around this position, create polyomino of 13 (tridecomino)
    let directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: -1, dy: 0},
        {dx: 0, dy: -1}
    ];
    let nMino = 1;
    let nMinoMax = 13;
    let direction = directions[Math.floor(Math.random() * directions.length)];
    while (nMino < nMinoMax) {
        let newPosition = {
            x: position.x + direction.dx,
            y: position.y + direction.dy
        };
        if (newPosition.x < 0) {
            newPosition.x += nCols;
        }
        if (newPosition.x >= nCols) {
            newPosition.x -= nCols;
        }
        if (newPosition.y < 0) {
            newPosition.y += nRows;
        }
        if (newPosition.y >= nRows) {
            newPosition.y -= nRows;
        }
        if (grid[newPosition.y][newPosition.x] === 0) {
            grid[newPosition.y][newPosition.x] = nMinoMax;
            // to prevent being closed in by the polyomino
            // only change direction if there is a free cell
            // To ponder about: does this create all possible polyominos?
            direction = directions[Math.floor(Math.random() * directions.length)];
            nMino++;
        }
        position = newPosition;
    }

    // remove all rows and columns that are empty, and have adjacent empty rows or columns
    // remove rows
    grid = grid.filter((row, y) => row.some((value, x) => {
        return value !== 0 || grid[(y + 1) % nRows].some((value, x) => value !== 0);
    }));
    // remove columns
    let emptyCols = Array(nCols).fill(0);
    emptyCols = emptyCols.map((value, x) => grid.every(row => row[x] === 0));
    grid = grid.map((row, y) => row.filter((value, x) => {
        return value !== 0 || !emptyCols[x] || !emptyCols[(x + 1) % nCols];
    }));

    // update nRows and nCols
    nRows = grid.length;
    nCols = grid[0].length;

    // Place a 1 where the remaining empty row and column intersect
    // This is the starting point for the player
    let emptyRow = grid.findIndex(row => row.every(value => value === 0));
    let emptyCol = grid[0].findIndex((value, x) => grid.every(row => row[x] === 0));
    let start = {x: emptyCol, y: emptyRow};

    // Switch rows and columns to make the start point the top left corner
    while (start.y > 0) {
        grid.push(grid.shift());
        start.y--;
    }
    while (start.x > 0) {
        grid.forEach(row => row.push(row.shift()));
        start.x--;
    }

    // Add the start to the grid
    grid[start.y][start.x] = 1;

    // Add a row of 0s to the bottom of the grid
    grid.push(Array(nCols).fill(0));
    nRows = grid.length;
    // Add a column of 0s to the right of the grid
    grid = grid.map(row => row.concat(0));
    nCols = grid[0].length;

    let target = {x: nCols - 1, y: nRows - 1};
    grid[target.y][target.x] = 3;

    // Move the start and target diagonally closer to each other
    // Until they are adjecent to a 13
    directions = [
        {dx: 1, dy: 0},
        {dx: 0, dy: 1}
    ];
    direction = directions[0];
    grid[start.y][start.x] = 0;
    while (grid[start.y + direction.dy][start.x + direction.dx] !== 13) {
        start.x += direction.dx;
        start.y += direction.dy;
        direction = directions[1 - directions.indexOf(direction)];
    }
    grid[start.y][start.x] = 1;
    directions = [
        {dx: -1, dy: 0},
        {dx: 0, dy: -1}
    ];
    direction = directions[0];
    grid[target.y][target.x] = 0;
    while (grid[target.y + direction.dy][target.x + direction.dx] !== 13) {
        target.x += direction.dx;
        target.y += direction.dy;
        direction = directions[1 - directions.indexOf(direction)];
    }
    grid[target.y][target.x] = 3;

    // Replace with 2s all 0s surrounded by 0s and/or 2s
    // Wrapping around the grid is considered 
    // Diagonal cells are considered
    //grid[start.y][start.x] = 0; // No pool
    //grid[target.y][target.x] = 0; // No pool
    for (let y = 0; y < nRows; y++) {
        for (let x = 0; x < nCols; x++) {
            if (grid[y][x] === 0) {
                let isSurrounded = true;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        let neighbour = grid[(y + dy + nRows) % nRows][(x + dx + nCols) % nCols];
                        if (neighbour !== 0 && neighbour !== 2) {
                            isSurrounded = false;
                        }
                    }
                }
                if (isSurrounded) {
                    grid[y][x] = 2;
                }
            }
        }
    }

    // We will not use a start and target,
    // instead they became pools
    grid[start.y][start.x] = 0;
    grid[target.y][target.x] = 0;

    // Update the textTiles
    textTiles = grid.map((row, y) => row.map((value, x) => ft({text: String(value), x: x * 40, y: y * 40})));

    level.emit('color', {'c0': 'Aqua', 'c1': 'Seashell', 'c2': 'SandyBrown', 'c3': 'Seashell', 'c13': 'Aqua'});

    level.on('tap', e => {
        let {x, y} = e;
        let {vw, vh} = level.last('resize');
        let tx = x + cam.x + cam.offset.x;
        let ty = y + cam.y + cam.offset.y;
        cam.target.x = tx;
        cam.target.y = ty;
        while (tx < 0) {
            tx += 40 * nCols;
        }
        while (ty < 0) {
            ty += 40 * nRows;
        }
        let gx = Math.floor(tx / 40) % nCols;
        let gy = Math.floor(ty / 40) % nRows;
        if (gx < 0 || gx >= nCols || gy < 0 || gy >= nRows) {
            return;
        }
        let value = grid[gy][gx];
        if (value === 0) {
            grid[gy][gx] = 1;
            return;
        }
        if (value === 13) {
            level.off('tap');
            // show solution
            level.emit('color', {'c0': 'Aqua', 'c1': 'Seashell', 'c2': 'SandyBrown', 'c3': 'Seashell', 'c13': 'Coral'});
            level.once('tap', () => {
                level.machine.restart('level');
            });
        }
    });
});

let offCanvas = new OffscreenCanvas(40, 40);
let offCtx = offCanvas.getContext('2d');
let printNumbers = false;

level.on('draw', e => {
    let {ctx} = e;

    let cx = Math.floor(cam.x + cam.offset.x);
    let cy = Math.floor(cam.y + cam.offset.y);
    ctx.translate(-cx, -cy);

    offCanvas.width = 40 * nCols;
    offCanvas.height = 40 * nRows;
    for (let y = 0; y < nRows; y++) {
        for (let x = 0; x < nCols; x++) {
            offCtx.fillStyle = level.last('color')[`c${grid[y][x]}`];
            offCtx.fillRect(x * 40, y * 40, 40, 40);
        }
    }
    let bgPattern = ctx.createPattern(offCanvas, 'repeat');
    ctx.fillStyle = bgPattern;
    let {vw, vh} = level.last('resize');
    ctx.fillRect(cx, cy, vw, vh);

    if (printNumbers) {
        ctx.fillStyle = '#000';
        textTiles.forEach(row => row.forEach(
            tile => {tile.draw(e)}
        ));
    }
});

level.on('step', e => {
    let {dt} = e;
    let {x, y, target} = cam;
    let dx = target.x - x;
    let dy = target.y - y;
    let speed = 0.005 * dt;
    cam.x += dx * speed;
    cam.y += dy * speed;
});

level.on('resize', e => {
    let {vw, vh} = e;
    cam.offset.x = -Math.floor(vw / 2);
    cam.offset.y = -Math.floor(vh / 2);
});

export default level;
