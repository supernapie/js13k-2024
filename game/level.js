import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';

let level = state();

// a grid
let nRows = 14;
let nCols = 14;
let grid = Array(nRows).fill(0).map(() => Array(nCols).fill(0));

let textTiles = grid.map((row, y) => row.map((value, x) => ft({text: String(value), x: x * 40, y: y * 40})));

level.on('start', () => {

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

    // Replace all 13 with -1
    grid = grid.map(row => row.map(value => value === 13 ? -1 : value));

    // Place a 1 where the remaining empty row and column intersect
    // This is the starting point for the player
    let emptyRow = grid.findIndex(row => row.every(value => value === 0));
    let emptyCol = grid[0].findIndex((value, x) => grid.every(row => row[x] === 0));
    let start = {x: emptyCol, y: emptyRow};

    // change everything which isn't -1 to 0
    grid = grid.map(row => row.map(value => value === -1 ? value : 0));

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

    // Replace all -1 with 13
    grid = grid.map(row => row.map(value => value === -1 ? 13 : value));

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

    // Surround the grid with 2s
/*    grid = grid.map(row => [2].concat(row, [2]));*/
    /*grid = [[...Array(nCols + 2).fill(2)]].concat(grid, [[...Array(nCols + 2).fill(2)]]);*/
    /*nRows = grid.length;*/
    /*nCols = grid[0].length;*/
    /*start = {x: start.x + 1, y: start.y + 1};*/
    /*target = {x: target.x + 1, y: target.y + 1};*/

    // Replace with 2s all 0s surrounded by 0s and/or 2s
    // Wrapping around the grid is considered 
    // Diagonal cells are considered
    grid[start.y][start.x] = 0;
    grid[target.y][target.x] = 0;
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

    grid[start.y][start.x] = 1;
    grid[target.y][target.x] = 3;

    // Update the textTiles
    textTiles = grid.map((row, y) => row.map((value, x) => ft({text: String(value), x: x * 40, y: y * 40})));

    level.emit('color', {'c0': 'SeaGreen', 'c1': 'Aqua', 'c2': 'LightCoral', 'c3': 'Aqua', 'c13': 'SeaGreen'});

    // restart the level on tap
    level.once('tap', () => {
        level.emit('color', {'c0': 'Seashell', 'c1': 'Aqua', 'c2': 'LightCoral', 'c3': 'Aqua', 'c13': 'DarkSeaGreen'});
        level.once('tap', () => {
            level.machine.restart('level');
        });
    });
});

level.on('draw', e => {
    let {ctx} = e;
    for (let y = 0; y < nRows; y++) {
        for (let x = 0; x < nCols; x++) {
            ctx.fillStyle = level.last('color')[`c${grid[y][x]}`];
            ctx.fillRect(x * 40, y * 40, 40, 40);
        }
    }
    textTiles.forEach(row => row.forEach(
        tile => {
            let colors = level.last('color');
            ctx.fillStyle = '#000000';
            tile.draw(e);
        }
    ));
});

export default level;
