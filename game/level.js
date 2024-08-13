import state from './js/statemachine/state.js';
import ft from './js/draw/text.js';

let level = state();

// a grid
//let nRows = 52;
let nRows = 20;
//let nCols = 26;
let nCols = 15;
let grid = Array(nRows).fill(0).map(() => Array(nCols).fill(0));

let textTiles = grid.map((row, y) => row.map((value, x) => ft({text: String(value), x: x * 40, y: y * 40})));

level.on('start', () => {

    // Reset all to 0
    grid.forEach(row => row.fill(0));

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

    // Update the textTiles
    textTiles.forEach((row, y) => row.forEach(
        (tile, x) => tile.text = String(grid[y][x])
    ));

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
