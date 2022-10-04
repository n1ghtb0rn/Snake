window.addEventListener('load', setup);

const ROWS = 20;
const COLUMNS = 20;
let squares = [[]];
let snakeParts = [];
let playfieldNode;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
let direction = RIGHT;
let newDirection = RIGHT;

const NUMBER_OF_APPLES = 10;

const fps = 150;

let gameOver = false;

window.addEventListener("keydown", input);

//Setup
function setup() {

    playfieldNode = document.getElementById("playfield");
    playfieldNode.style.width = (ROWS * 20) + "px";

    for (let y = 0; y < ROWS; y++) {
        squares[y] = [];
        for (let x = 0; x < COLUMNS; x++) {
            squares[y][x] = "";
        }
    }

    for (let y = 0; y < ROWS; y++) {
        let rowNode = document.createElement("div");
        rowNode.classList.add("row");
        playfieldNode.appendChild(rowNode);
        let rowArray = [];
        for (let x = 0; x < COLUMNS; x++) {
            let squareNode = document.createElement("div");
            squareNode.classList.add("square");
            rowNode.appendChild(squareNode);
            rowArray.push(rowNode);
            squareNode.y = y;
            squareNode.x = x;
            squares[y][x] = squareNode;
        }
    }

    let centerY = ROWS / 2;
    let centerX = COLUMNS / 2;

    console.log(squares[centerY][centerX]);

    squares[centerY][centerX-4].classList.remove("square");
    squares[centerY][centerX-4].classList.add("snake-part");
    snakeParts.push(squares[centerY][centerX-4]);

    squares[centerY][centerX-3].classList.remove("square");
    squares[centerY][centerX-3].classList.add("snake-part");
    snakeParts.push(squares[centerY][centerX-3]);

    squares[centerY][centerX-2].classList.remove("square");
    squares[centerY][centerX-2].classList.add("snake-part");
    snakeParts.push(squares[centerY][centerX-2]);

    squares[centerY][centerX-1].classList.remove("square");
    squares[centerY][centerX-1].classList.add("snake-part");
    snakeParts.push(squares[centerY][centerX-1]);

    squares[centerY][centerX].classList.remove("square");
    squares[centerY][centerX].classList.add("snake-part");
    snakeParts.push(squares[centerY][centerX]);

    for (let i = 0; i < 2; i++) {
        let snakeEye = document.createElement("div");
        snakeEye.classList.add("snake-eye-right");
        squares[centerY][centerX].appendChild(snakeEye);
    }

    for (let i = 0; i < NUMBER_OF_APPLES; i++) {
        generateApple();
    }

    let updateTimer = setInterval(update, fps);
    
}

function generateApple() {

    let foundSquare = null;

    do {

        let randomY = getRandomInt(0, ROWS);
        let randomX = getRandomInt(0, COLUMNS);
        let square = squares[randomY][randomX];
        if (square.classList.contains("square")) {
            foundSquare = square;
        }

    } while(foundSquare == null);

    foundSquare.classList.remove("square");
    foundSquare.classList.add("apple");

}

function removeSnakeEyes(oldHead) {
    oldHead.innerHTML = "";
}

function appendSnakeEyes(newHead) {

    let className = "";
    let flexDirection = "";

    switch (direction) {
        case RIGHT:
            className = "snake-eye-right";
            flexDirection = "column";
            break;
        case DOWN:
            className = "snake-eye-down";
            flexDirection = "row";
            break;
    
        case LEFT:
            className = "snake-eye-left";
            flexDirection = "column";
            break;

        case UP:
            className = "snake-eye-up";
            flexDirection = "row";
            break;
    
    } 

    for (let i = 0; i < 2; i++) {
        let snakeEye = document.createElement("div");
        snakeEye.classList.add(className);
        newHead.appendChild(snakeEye);
    }

    newHead.style.flexDirection = flexDirection;

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

function input(event) {

    if (gameOver) {
        return;
    }

    console.log(event);

    let key = event.key;

    if (key == " ") {
        //update();
        return;
    }

    switch (key) {

        case "ArrowRight":
            if (direction == LEFT) {
                break;
            }
            newDirection = RIGHT;
            break;

        case "ArrowDown":
            if (direction == UP) {
                break;
            }
            newDirection = DOWN;
            break;

        case "ArrowLeft":
            if (direction == RIGHT) {
                break;
            }
            newDirection = LEFT;
            break;

        case "ArrowUp":
            if (direction == DOWN) {
                break;
            }
            newDirection = UP;
            break;
    }

}

function update() {

    if (gameOver) {
        return;
    }

    direction = newDirection;

    let moveX, moveY;
    
    switch (direction) {
        case RIGHT:
            moveX = 1;
            moveY = 0;
            break;

        case DOWN:
            moveX = 0;
            moveY = 1;
            break;

        case LEFT:
            moveX = -1;
            moveY = 0;
            break;

        case UP:
            moveX = 0;
            moveY = -1;
            break;
    }

    let oldHead = snakeParts[snakeParts.length-1];
    removeSnakeEyes(oldHead);
    let oldY = oldHead.y;
    let oldX = oldHead.x;

    let newY = oldY+moveY;
    let newX = oldX+moveX;

    newY = newY < 0 ? newY+ROWS : newY;
    newY = newY > ROWS-1 ? 0 : newY;

    newX = newX < 0 ? newX+COLUMNS : newX;
    newX = newX > COLUMNS-1 ? 0 : newX;

    let newHead = squares[newY][newX];
    appendSnakeEyes(newHead);
    if (newHead.classList.contains("snake-part")) {
        alert("GAME OVER!");
        gameOver = true;
        return;
    }
    newHead.y = newY;
    newHead.x = newX;

    let appleFound = false;
    if (newHead.classList.contains("apple")) {
        newHead.classList.remove("apple");
        appleFound = true;
        generateApple();
    }

    newHead.classList.remove("square");
    newHead.classList.add("snake-part");
    snakeParts.push(newHead);

    if (!appleFound) {
        let oldPart = snakeParts.shift();
        oldPart.classList.remove("snake-part");
        oldPart.classList.add("square");
    }

   // let endTail = snakeParts[snakeParts.length-1];
    //endTail.classList.remove("snake-part");
    //endTail.classList.add("square");

}