const puzzles = {
    easy: [  
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, ""],  
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, "", 5], 
        [9, 1, 2, 3, 4, 5, 6, 7, ""]  
    ],
    medium: [
       
        [5, 3, "", "", 7, "", "", "", ""],
        [6, "", "", 1, 9, 5, "", "", ""],
        ["", 9, 8, "", "", "", "", 6, ""],
        [8, "", "", "", 6, "", "", "", 3],
        [4, "", "", 8, "", 3, "", "", 1],
        [7, "", "", "", 2, "", "", "", 6],
        ["", 6, "", "", "", "", 2, 8, ""],
        ["", "", "", 4, 1, 9, "", "", 5],
        ["", "", "", "", 8, "", "", 7, 9]
    ],
    hard: [
        ["", "", "", "", "", "", "", "", ""],
        [8, "", "", "", "", "", "", "", ""],
        ["", "", 3, 6, "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", 2, 8, ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
    ]
};

let startingGrid = [];

// Function to load the board
function loadBoard(difficulty) {
    startingGrid.length = 0;  // clear old board
    puzzles[difficulty].forEach(row => startingGrid.push([...row]));  
    createBoard();
    document.getElementById('message').textContent = "";
}


let selectedCell = null;

// Create board
function createBoard() {
    const board = document.getElementById('sudoku-board');
    board.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            const value = startingGrid[row][col];
            if (value !== "") {
                cell.textContent = value;
                cell.classList.add('given');
            }

            if ((col + 1) % 3 === 0 && col !== 8) {
                cell.classList.add('border-right');
            }
            if ((row + 1) % 3 === 0 && row !== 8) {
                cell.classList.add('border-bottom');
            }

            board.appendChild(cell);
        }
    }
}


// Create number popup
const popup = document.createElement('div');
popup.id = "number-popup";
document.body.appendChild(popup);

// Open number picker near mouse
function openPopup(cell, mouseX, mouseY) {
    selectedCell = cell;
    popup.innerHTML = "";

    const grid = document.createElement('div');
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 50px)";
    grid.style.gridGap = "5px";

    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement('div');
        btn.classList.add('num-btn');
        btn.textContent = i;
        btn.onclick = () => {
            cell.textContent = i;
            cell.classList.remove('error', 'success');
            hidePopup();
        };
        grid.appendChild(btn);
    }

    popup.appendChild(grid);

    const clearBtn = document.createElement('button');
    clearBtn.classList.add('clear-btn');
    
    clearBtn.textContent = "Clear";
    clearBtn.onclick = () => {
        cell.textContent = "";
        hidePopup();
    };
    popup.appendChild(clearBtn);

    popup.style.left = mouseX + 'px';
    popup.style.top = mouseY + 'px';
    popup.style.display = 'block';
}

// Hide number picker
function hidePopup() {
    popup.style.display = 'none';
}

// Validate full Sudoku board
function validateBoard() {
    const board = Array.from(document.querySelectorAll('.cell')).reduce((acc, cell) => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (!acc[row]) acc[row] = [];
        acc[row][col] = cell.textContent || "";
        return acc;
    }, []);

    let valid = true;

    document.querySelectorAll('.cell').forEach(c => {
        if (!c.classList.contains('given')) {
            c.classList.remove('error', 'success');
        }
    });

    function checkSet(values) {
        const seen = {};
        for (const val of values) {
            if (val !== "") {
                if (seen[val]) return false;
                seen[val] = true;
            }
        }
        return true;
    }

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        if (!checkSet(board[i])) {
            valid = false;
            markErrorRow(i);
        }
        const colValues = board.map(row => row[i]);
        if (!checkSet(colValues)) {
            valid = false;
            markErrorCol(i);
        }
    }

    // Check 3x3 blocks
    for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            const block = [];
            for (let i = r; i < r + 3; i++) {
                for (let j = c; j < c + 3; j++) {
                    block.push(board[i][j]);
                }
            }
            if (!checkSet(block)) {
                valid = false;
                markErrorBlock(r, c);
            }
        }
    }

    if (valid && document.querySelectorAll('.cell:not(.given)').length === 
    document.querySelectorAll('.cell:not(.given):not(:empty)').length) {
    
    // Success message
    document.getElementById('message').textContent = "🎉 Congratulations! Sudoku Solved!";
    document.getElementById('message').classList.remove('text-danger');
    document.getElementById('message').classList.add('text-success');
    
    // Add success class to board and cells
    const board = document.getElementById('sudoku-board');
    board.classList.add('solved');
    
    // Add success class to each cell with animation delay
    document.querySelectorAll('.cell').forEach((c, index) => {
        c.classList.add('success');
        c.style.animationDelay = `${index * 0.1}s`; // Staggered animation
    });
    
    // Add confetti effect
    setTimeout(() => {
        if (window.confetti) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, 500);
    
} else if (!valid) {
    // Error state
    document.getElementById('message').textContent = "🚨 There are mistakes!";
    document.getElementById('message').classList.remove('text-success');
    document.getElementById('message').classList.add('text-danger');
    
    // Remove success state if any
    document.getElementById('sudoku-board').classList.remove('solved');
}
}

// Mark errors by row
function markErrorRow(row) {
    document.querySelectorAll(`.cell[data-row="${row}"]`).forEach(c => {
        if (!c.classList.contains('given')) {
            c.classList.add('error');
        }
    });
}

// Mark errors by column
function markErrorCol(col) {
    document.querySelectorAll(`.cell[data-col="${col}"]`).forEach(c => {
        if (!c.classList.contains('given')) {
            c.classList.add('error');
        }
    });
}

// Mark errors in 3x3 block
function markErrorBlock(startRow, startCol) {
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            if (cell && !cell.classList.contains('given')) {
                cell.classList.add('error');
            }
        }
    }
}

// Board click listener
document.getElementById('sudoku-board').addEventListener('click', (e) => {
    if (e.target.classList.contains('cell') && !e.target.classList.contains('given')) {
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
        e.target.classList.add('selected');
        openPopup(e.target, e.pageX + 10, e.pageY + 10);
    } else {
        hidePopup();
    }
});

// Button listeners
document.getElementById('check-button').addEventListener('click', validateBoard);
document.getElementById('reset-button').addEventListener('click', () => {
    createBoard();
    document.getElementById('message').textContent = "";
    document.getElementById('sudoku-board').classList.remove('solved');
    document.querySelectorAll('.cell').forEach(c => {
        c.classList.remove('success');
        c.style.animationDelay = '';
    });
});



// Music controller
// Music control
const bgMusic = document.getElementById('bg-music');
const musicButton = document.getElementById('music-button');

// Try to play music on load (may be blocked by browser)
document.addEventListener('DOMContentLoaded', () => {
    bgMusic.volume = 0.3; // Set lower volume by default
    const playPromise = bgMusic.play();
    
    // Handle autoplay restrictions
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Autoplay was prevented, show muted state
            musicButton.textContent = '🔇 Unmute Music';
        });
    }
});

// Toggle music mute/unmute
musicButton.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicButton.textContent = '🔊 Mute Music';
    } else {
        bgMusic.pause();
        musicButton.textContent = '🔇 Unmute Music';
    }
});



// Initialize
loadBoard('medium');
createBoard();


document.addEventListener('DOMContentLoaded', () => {
    // Show welcome screen
    const welcomeScreen = document.getElementById('welcome-screen');
    

    
    window.addEventListener('load', () => {
      welcomeScreen.classList.add('fade-out');
      setTimeout(() => welcomeScreen.remove(), 5000);
    });
  });