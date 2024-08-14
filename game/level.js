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
    let start = {x: emptyCol, y: emptyRow, rank: 0};

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

    // Add the start and target to the grid
    grid[start.y][start.x] = 1;

    // Update the textTiles
    textTiles = grid.map((row, y) => row.map((value, x) => ft({text: String(value), x: x * 40, y: y * 40})));

    // restart the level on tap
    level.once('tap', () => {
        level.machine.restart('level');
    });
});

level.on('draw', e => {
    textTiles.forEach(row => row.forEach(
        tile => tile.draw(e)
    ));
});

export default level;
