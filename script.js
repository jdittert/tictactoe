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



const playerFactory = (playerName, sign) => ({ playerName, sign });

const game = GameBoard();
game.printBoard();

