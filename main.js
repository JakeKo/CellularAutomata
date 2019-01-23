const CELL_SIZE = 10; // Side length in pixels
const CANVAS_RESOLUTION = 3;

(function() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");

    canvas.width = canvas.clientWidth * CANVAS_RESOLUTION;
    canvas.height = canvas.clientHeight * CANVAS_RESOLUTION;

    const rowLength = Math.floor(canvas.width / CELL_SIZE);
    const rowCount = Math.floor(canvas.height / CELL_SIZE);

    for (let i = 0; i < rowCount; i++) {
        renderRow(context, i, getRandomRow(rowLength));
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