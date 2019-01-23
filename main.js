const CELL_SIZE = 10; // Side length in pixels
const CANVAS_RESOLUTION = 2;
const NEIGHBORHOOD_RADIUS = 1;
const RULE = decimalToBinaryArray(30);
const STEP_TICK = 5;

(function() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");

    canvas.width = canvas.clientWidth * CANVAS_RESOLUTION;
    canvas.height = canvas.clientHeight * CANVAS_RESOLUTION;

    const rowLength = Math.floor(canvas.width / CELL_SIZE);
    const rowCount = Math.floor(canvas.height / CELL_SIZE);

    // Create the first row
    let i = 0;
    let row = getRandomRow(rowLength);

    const step = () => {
        renderRow(context, i++, row);
        const nextRow = evaluateNextRow(row);
        row = nextRow;
        
        if (i < rowCount) setTimeout(step, STEP_TICK)
    };

    // Evaluate each subsequent row
    setTimeout(step, STEP_TICK);
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

// Evaluates the next row of cells based on the provided rule and the previous row
function evaluateNextRow(row) {
    const nextRow = [];

    for (let i = 0; i < row.length; i++) {
        const neighborhood = getNeighborhood(row, i);
        const sum = binarySum(neighborhood);
        nextRow.push(RULE[sum] === 1 ? 0 : 1);
    }

    return nextRow;
}

// Returns the neighborhood of a given radius around an index (wrapping-enabled)
function getNeighborhood(row, index) {
    const neighborhood = [];

    for (let i = index - NEIGHBORHOOD_RADIUS; i <= index + NEIGHBORHOOD_RADIUS; i++) {
        neighborhood.push(row[mod(i, row.length)]);
    }

    return neighborhood;
}

// Utility methods
function binarySum(array) {
    const binaryString = array.join("");
    return parseInt(binaryString, 2);
}

function decimalToBinaryArray(decimal) {
    const binaryStringArray = decimal.toString(2).padStart(8, "0").split("");
    return binaryStringArray.map(digit => Number(digit));
}

function mod(value, modulo) {
    return (value % modulo + modulo) % modulo;
}