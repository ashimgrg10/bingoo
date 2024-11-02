const bingoBoard = document.getElementById('bingo-board');
const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset-game');
const numberDisplay = document.getElementById('number'); // Display for the drawn number
const countDisplay = document.getElementById('count');
const historyDisplay = document.getElementById('history');
const timerDisplay = document.getElementById('timer'); // Timer display

let drawnNumbers = [];
let userBoard = [];
let currentDrawnNumber = null;
let drawCount = 0; // Initialize draw count
let drawInterval; // Variable to store the interval
let countdownInterval; // Variable for countdown interval
let countdownTime = 10; // Countdown time in seconds

// Shuffle function for Bingo Board
function generateShuffledArray(size, maxNumber) {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap
    }
    return numbers.slice(0, size);
}

// Generate Bingo Board with Shuffled Numbers
function generateBoard() {
    bingoBoard.innerHTML = '';
    userBoard = [];
    const shuffledNumbers = generateShuffledArray(25, 75);

    shuffledNumbers.forEach((number, index) => {
        let cell = document.createElement('div');
        cell.classList.add('bingo-cell');
        cell.innerText = number;
        
        // Set up click event for the cell
        cell.addEventListener('click', () => handleCellClick(cell, number, index));
        
        bingoBoard.appendChild(cell);
        userBoard.push(false); // Track marked status for each cell
    });
}

// Draw a Random Number
function drawNumber() {
    if (drawnNumbers.length >= 75) {
        alert('All numbers have been drawn!');
        clearInterval(drawInterval); // Stop the interval if all numbers are drawn
        clearInterval(countdownInterval); // Stop the countdown if all numbers are drawn
        return;
    }
    
    let number;
    do {
        number = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(number));

    drawnNumbers.push(number);
    currentDrawnNumber = number;
    numberDisplay.innerText = number;
    
    // Increment and update the draw count
    drawCount++;
    countDisplay.innerText = drawCount;
    
    // Update the drawn history display
    historyDisplay.innerText = drawnNumbers.join(', ');

    // Reset countdown to 10 seconds after drawing a number
    resetCountdown();
}

// Handle Cell Click for Manual Marking
function handleCellClick(cell, number, index) {
    if (number === currentDrawnNumber) {
        cell.classList.add('marked'); // Mark the cell if it matches the drawn number
        userBoard[index] = true; // Update user board marking status
        currentDrawnNumber = null; // Reset current drawn number
        checkForBingo();
    } else {
        alert('This is not the drawn number! Try again.');
    }
}

// Check for Bingo
function checkForBingo() {
    const winPatterns = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    for (let pattern of winPatterns) {
        if (pattern.every(index => userBoard[index])) {
            alert('Bingo!');
            clearInterval(drawInterval); // Stop drawing numbers on win
            clearInterval(countdownInterval); // Stop countdown on win
            return;
        }
    }
}

// Reset Game
function resetGame() {
    drawnNumbers = [];
    currentDrawnNumber = null;
    numberDisplay.innerText = '';
    drawCount = 0; // Reset draw count
    countDisplay.innerText = drawCount;
    historyDisplay.innerText = 'None'; // Reset drawn history display
    clearInterval(drawInterval); // Clear the drawing interval
    clearInterval(countdownInterval); // Clear the countdown interval
    countdownTime = 10; // Reset countdown time
    timerDisplay.innerText = countdownTime; // Reset timer display
    generateBoard();
}

// Start the automatic drawing of numbers
function startDrawing() {
    if (drawInterval) {
        clearInterval(drawInterval); // Clear any existing interval
    }
    generateBoard(); // Generate a new board
    drawNumber(); // Draw an initial number
    drawInterval = setInterval(drawNumber, 10000); // Set interval to draw a number every 10 seconds
    resetCountdown(); // Start countdown from 10
}

// Reset Countdown
function resetCountdown() {
    clearInterval(countdownInterval); // Clear any existing countdown interval
    countdownTime = 10; // Reset countdown time to 10 seconds
    timerDisplay.innerText = countdownTime; // Display initial countdown time
    countdownInterval = setInterval(() => {
        countdownTime--;
        timerDisplay.innerText = countdownTime; // Update displayed timer
        if (countdownTime <= 0) {
            alert("Time's up! Drawing a new number.");
            drawNumber(); // Automatically draw a new number when the timer reaches 0
            resetCountdown(); // Reset the countdown
        }
    }, 1000); // Update countdown every second
}

// Event Listeners
startButton.addEventListener('click', startDrawing); // Start drawing on button click
resetButton.addEventListener('click', resetGame); // Reset game on button click

// Initialize Board
generateBoard();
