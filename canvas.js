const
    scl = 10,
    noiseIncXY = 0.005,
    noiseIncZ = 0.005,
    noiseScale = 0.002;
let canvas, grid, cols, rows;
let xOff = 0,
    yOff = 0.6,
    zOff = 0;

function getSize() {
    const widthToRemove = window.innerWidth % scl;
    const heightToRemove = window.innerHeight % scl;
    const w = window.innerWidth - widthToRemove;
    const h = window.innerHeight - heightToRemove;
    return { w, h };
}


function setup() {
    const { w, h } = getSize();
    canvas = createCanvas(w, h, P2D);
    const mainNodeDOM = canvas.parent();
    canvas.parent("canvas-container");
    mainNodeDOM.remove();
    noiseDetail(10, 0.5);

    cols = 2 + (width / scl);
    rows = 2 + (height / scl);

    grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = random(1);
        }
    }
}

function draw() {
    background(120);

    forSpotInGrid(grid, ({ i, j, x, y, n }) => {
        const middles = getMiddles(x, y);
        const state = getState(i, j);
        stroke(255);
        strokeWeight(1);
        drawContourBasedOnState(state, middles);
        stroke(constrain(n * 255, 120, 255));
        // stroke(grid[i][j] * 255);
        strokeWeight(6);
        point(x, y);
    });
}

function drawContourBasedOnState(state, middles) {
    const { mt, mr, mb, ml } = middles;

    function vLine(v1, v2) {
        line(v1.x, v1.y, v2.x, v2.y);
    }

    if (state == 1 || state == 14)
        vLine(ml, mb);
    else if (state == 2 || state == 13)
        vLine(mb, mr);
    else if (state == 3 || state == 12)
        vLine(ml, mr);
    else if (state == 4 || state == 11)
        vLine(mt, mr);
    else if (state == 6 || state == 9)
        vLine(mt, mb);
    else if (state == 7 || state == 8)
        vLine(ml, mt);
    else if (state == 10) {
        vLine(mt, mr);
        vLine(mb, ml);
    } else if (state == 5) {
        vLine(mt, ml);
        vLine(mb, mr);
    }
}

function getState(i, j) {
    const tl = grid[i][j];
    const tr = grid[i + 1][j];
    const br = grid[i + 1][j + 1];
    const bl = grid[i][j + 1];
    return tl * 8 + tr * 4 + br * 2 + bl;
}

function getMiddles(x, y) {
    const mt = { x: x + (scl / 2), y };
    const mr = { x: x + scl, y: y + (scl / 2) };
    const mb = { x: x + (scl / 2), y: y + scl };
    const ml = { x, y: y + (scl / 2) };
    return { mt, mr, mb, ml };
}

function forSpotInGrid(grid, action) {
    // xOff = 0;
    for (let i = 0; i < grid.length - 1; i++) {
        // xOff += noiseIncXY;
        // yOff = 0.6;
        for (let j = 0; j < grid[i].length - 1; j++) {
            const x = i * scl;
            const y = j * scl;
            // let n = noise(xOff * noiseScale, yOff * noiseScale, zOff);
            let n = noise((mouseX + x) * noiseScale, (mouseY + y) * noiseScale, zOff);
            let nVal = n > 0.5 ? 1 : 0;
            grid[i][j] = nVal;
            action({ i, j, x, y, n });
            // yOff += noiseIncXY;
        }
    }
    zOff += noiseIncZ
}