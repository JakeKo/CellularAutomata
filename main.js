const CELL_SIZE = 10; // Side length in pixels
const NEIGHBORHOOD_RADIUS = 2;
const RULE_LENGTH = Math.pow(2, 2 * NEIGHBORHOOD_RADIUS + 1);

let canvas, context, rowLength, rowCount, renderTimeout = -1;

(function() {
    const ruleField = document.getElementById("field-rule");
    ruleField.addEventListener("input", onRuleUpdated);

    const max = Math.pow(2, RULE_LENGTH), value = Math.round(Math.random() * max);
    ruleField.max = max;
    ruleField.value = value;
    document.getElementById("label-rule-max").innerHTML = max;
    document.getElementById("label-rule").innerHTML = `Rule: ${value}`;
    
    canvas = document.getElementsByTagName("canvas")[0];
    context = canvas.getContext("2d");

    const canvasResolution = 2;
    canvas.width = canvas.clientWidth * canvasResolution;
    canvas.height = canvas.clientHeight * canvasResolution;

    rowLength = Math.floor(canvas.width / CELL_SIZE);
    rowCount = Math.floor(canvas.height / CELL_SIZE);

    startAutomata(value);
})();

function onRuleUpdated(event) {
    const newRule = parseInt(event.target.value);
    document.getElementById("label-rule").innerHTML = `Rule: ${newRule}`;

    startAutomata(newRule);
}

function startAutomata(rule) {
    // Clear the canvas
    clearTimeout(renderTimeout);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Create the first row
    let i = 0;
    let row = getRandomRow(rowLength);

    // Evaluate each subsequent row
    const step = () => {
        renderRow(context, i++, row);
        const nextRow = evaluateNextRow(row, rule);
        row = nextRow;
        
        if (i < rowCount) renderTimeout = setTimeout(step, 3);
    };

    // Begin the loop
    step();
}

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
function evaluateNextRow(row, rule) {
    const ruleMap = decimalToBinaryArray(rule);
    const nextRow = [];

    for (let i = 0; i < row.length; i++) {
        const neighborhood = getNeighborhood(row, i);
        const sum = binarySum(neighborhood);
        nextRow.push(ruleMap[sum] === 1 ? 0 : 1);
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
    const binaryStringArray = decimal.toString(2).padStart(RULE_LENGTH, "0").split("");
    return binaryStringArray.map(digit => Number(digit));
}

function mod(value, modulo) {
    return (value % modulo + modulo) % modulo;
}