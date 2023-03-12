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
        console.log(boardWithCellValues);
      };
    
      function Cell() {
        const value = 0;
    
        const getValue = () => value;
        return {
            getValue
        };
    }

    return { getBoard, printBoard };
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
        document.getElementById("current-turn").innerText = `The current player is ${currentPlayer.playerName}`;
    };

    printCurrentRound();
}

    
const game = GameController();


