const CELL_SIZE = 30; // Side length in pixels
const CANVAS_RESOLUTION = 3;
const NEIGHBORHOOD_RADIUS = 1;

(function() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");

    canvas.width = canvas.clientWidth * CANVAS_RESOLUTION;
    canvas.height = canvas.clientHeight * CANVAS_RESOLUTION;

    const rowLength = Math.floor(canvas.width / CELL_SIZE);
    const rowCount = Math.floor(canvas.height / CELL_SIZE);

    // Create the first row
    let row = getRandomRow(rowLength);
    renderRow(context, 0, row);

    // Evaluate each subsequent row
    for (let i = 1; i < rowCount; i++) {
        const nextRow = evaluateNextRow(row);
        renderRow(context, i, nextRow);
        row = nextRow;
    }
})();

// Reuturns an array of the specified length with a random assortment of 0 and 1
function getRandomRow(length) {
    const row = [];

    for (let i = 0; i < length; i++) {
        row.push(Math.round(Math.random()));
    }

    return row;
}

// Renders a row on the canvas at the given index
function renderRow(context, rowIndex, row) {
    row.forEach((cell, cellIndex) => {
        const x = cellIndex * CELL_SIZE;
        const y = rowIndex * CELL_SIZE;

        context.fillStyle = cell === 0 ? "#000000" : "#FFFFFF";
        context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    });
}

function evaluateNextRow(row) {
    const nextRow = [];

    for (let i = 0; i < row.length; i++) {
        const neighborhood = getNeighborhood(row, i);

        // TODO: Implement rule behavior
        const sum = neighborhood.reduce((base, value) => base + value);
        nextRow.push(sum < neighborhood.length / 2 ? 0 : 1);
    }

    return nextRow;
}

function getNeighborhood(row, index) {
    const neighborhood = [];

    for (let i = index - NEIGHBORHOOD_RADIUS; i <= index + NEIGHBORHOOD_RADIUS; i++) {
        neighborhood.push(row[mod(i, row.length)]);
    }

    return neighborhood;
}

function mod(value, modulo) {
    return (value % modulo + modulo) % modulo;
}