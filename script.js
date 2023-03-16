/* Used the example given in the assignment as a starting point for this code.
https://replit.com/@40percentzinc/ConnectFourWithDOMSkeleton#script.js */

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
    };

    // Check for a winner
    function checkWinner() {
        const checkBoard = board.getBoard();
        let wins = 0;     
        // Check rows
        checkBoard.forEach((row) => {
        const rowCheck = [];
        row.forEach((cell) => { rowCheck.push(cell.getValue()); });
        const rowFilter = rowCheck.filter(sign => sign === getCurrentPlayer().sign);           
        if (rowFilter.length === 3) {
            wins += 1;
            }                                             
        })
        return wins; 
    }   

    // Put a marker on the square if it is not occupied
    function playRound(row, column) {
        const check = board.updateSquare(row, column, getCurrentPlayer().sign);
            if (check === true) {
                const winner = checkWinner();
                if (winner === 1) {
                    document.getElementById("winner").textContent = "We have a winner!"
                    return;
                }               
                switchPlayer();
                printCurrentRound(); 
            };                               
    }

    return { playRound, getCurrentPlayer, getBoard: board.getBoard };
}

function displayController() {
    const game = GameController();      
    const buttonBoard = document.getElementById("button-board");    

    function updateBoard() {
        buttonBoard.innerHTML = "";
        const board = game.getBoard();
        const currentPlayer = game.getCurrentPlayer();
        const turnDiv = document.getElementById("current-turn");

        turnDiv.textContent = `The current player is ${currentPlayer.playerName}. (${currentPlayer.sign})`

        board.forEach((row, index) => {
            const rowData = index;
            row.forEach((cell, column) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.column = column;
                cellButton.dataset.row = rowData;
                if (cell.getValue() !== 0) {
                    cellButton.textContent = cell.getValue();
                    cellButton.classList.add("occupied");
                }
                buttonBoard.appendChild(cellButton);
            })
        })        
    }

    function boardListener(event) {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;        
        if (!selectedColumn) return;
        if (!selectedRow) return;
        game.playRound(selectedRow, selectedColumn);
        updateBoard();
    }

    buttonBoard.addEventListener("click", boardListener);

    updateBoard();    
}


displayController();