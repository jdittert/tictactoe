/* eslint-disable no-use-before-define */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    // eslint-disable-next-line consistent-return
    const updateSquare = (row, column, player) => {
        const squareValue = board[row][column].getValue();        
        if (squareValue !== 0) {
            return false;
        };
        board[row][column].addMarker(player);
        return true;                   
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        
        // Surely there's a way to do this without creating another array
        const boardForPrinting = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                boardForPrinting.push(boardWithCellValues[i][j]);
            }
        }
        
        for (let i = 1; i < 10; i++) {
            document.getElementById(`game-box-${i}`).innerText = `${boardForPrinting[i - 1]}`;
        }          
      };
    
    return { getBoard, printBoard, updateSquare };
}

function Cell() {
    let value = 0;  

    const addMarker = (player) => {
        value = player;        
    }

    const getValue = () => value;
    
    return {
        addMarker,
        getValue
    };
}

function GameController() {
    // Import the board
    const board = GameBoard();

    // Set up the two players
    const playerFactory = (playerName, sign) => ({ playerName, sign });
    const players = [];
    players.push(playerFactory("Player One", "X"));
    players.push(playerFactory("Player Two", "O"));
    
    // Set the turn
    let currentPlayer = players[0];

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    // Print the board after every move
    const printCurrentRound = () => {
        board.printBoard();
        document.getElementById("current-turn").innerText = `The current player is ${currentPlayer.playerName}. (${currentPlayer.sign})`;
    };

    function playRound() {
        function placeMarker(event) {
            const currentSpace = event.target;
            const {i} = currentSpace.dataset;
            const {j} = currentSpace.dataset;
            const check = board.updateSquare(i, j, getCurrentPlayer().sign);
            if (check === true) {
                switchPlayer();
                printCurrentRound(); 
            }                     
        };        
        const spaces = document.querySelectorAll("div.game-box");        
        spaces.forEach(space => space.addEventListener("click", placeMarker));        
    }

    playRound();

    return { playRound, getCurrentPlayer, getBoard: board.getBoard };
}

function displayController() {
    const game = GameController();      
    const buttonBoard = document.getElementById("button-board");
    function updateText(event) {
        const currentButton = event.target;
        currentButton.textContent = "Change!";
    }

    function updateBoard() {
        buttonBoard.innerHTML = "";
        const board = game.getBoard();
        board.forEach((row, index) => {
            const rowData = index;
            row.forEach((cell, column) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.column = column;
                cellButton.dataset.row = rowData;
                cellButton.textContent = cell.getValue();
                buttonBoard.appendChild(cellButton);
            })
        })
        
    }

    updateBoard();

    return { updateBoard }
}
    
const game = GameController();
const newGame = displayController();