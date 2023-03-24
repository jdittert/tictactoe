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
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        return boardWithCellValues;          
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

    // Allow players to change their name
    const forms = document.getElementsByTagName("form");    
    function updateName() {        
        Array.from(forms).forEach(form => form.addEventListener("submit", renamePlayer));
        function renamePlayer(event) {
            const playerIndex = event.target.dataset.index;
            const nameForm = event.target;            
            const formData = new FormData(nameForm);
            const formName = formData.get("player-name");
            players[playerIndex].playerName = formName;            
            nameForm.reset();
            nameForm.parentNode.style.display = "none";
            displayNames();     
            event.preventDefault();
        }        
    }
    
    function displayNames() {
        document.getElementById("player-one").textContent = `${players[0].playerName} (${players[0].sign})`;
        document.getElementById("player-two").textContent = `${players[1].playerName} (${players[1].sign})`;
        const turnDiv = document.getElementById("current-turn");
        turnDiv.textContent = `${currentPlayer.playerName}'s turn. (${currentPlayer.sign})`
    }
    
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
        const newBoard = board.printBoard();                      
        let wins = 0;     
        // Check rows
        newBoard.forEach((row) => {
        const rowCheck = [];
        row.forEach((cell) => { rowCheck.push(cell); });
        const rowFilter = rowCheck.filter(sign => sign === getCurrentPlayer().sign);           
        if (rowFilter.length === 3) {
            wins += 1;
            }                                             
        })
        // Check columns
        for (let i = 0; i < newBoard.length; i++) {
            const colCheck = [];
            for (let j = 0; j < newBoard[i].length; j++) {
                colCheck.push(newBoard[j][i]);
            }
            const colFilter = colCheck.filter(sign => sign === getCurrentPlayer().sign);
            if (colFilter.length === 3) {
                wins += 1;
            }
        }
        // Check diagonals
        const negSlope = [];
        for (let i = 0; i < newBoard.length; i++) {            
            negSlope.push(newBoard[i][i]);
        }
        const negSlopeFilter = negSlope.filter(sign => sign === getCurrentPlayer().sign);        
        if (negSlopeFilter.length === 3) {
            wins += 1;
        }        
        const posSlope = [];  
        for (let i = 0; i < newBoard.length; i++) {            
                posSlope.push(newBoard[i][(newBoard.length - 1) - i]);
        }       
        const posSlopeFilter = posSlope.filter(sign => sign === getCurrentPlayer().sign);        
        if (posSlopeFilter.length === 3) {
            wins += 1;
        }
        // Check for ties
        let emptySpace = true;
        const emptyCheck = [];
        newBoard.forEach((row) => {
            row.forEach((cell) => {
                if (cell === 0) emptyCheck.push(cell);
            })             
        })
        if (emptyCheck.length === 0) {
            emptySpace = false;
        }
        
        // Note: this is only the return for the checkWinner function
        return { wins, emptySpace }; 
    }   

    // Put a marker on the square if it is not occupied, then check for winner
    function playRound(row, column) {
        const check = board.updateSquare(row, column, getCurrentPlayer().sign);
            if (check === true) {
                const winner = checkWinner().wins;                
                if (winner === 1) {                   
                    return false;                  
                } 
                if (!checkWinner().emptySpace) {                    
                    return null;
                }            
                switchPlayer();
                printCurrentRound(); 
                return true;                
            };
            return true;                         
    }

    // Reset the board
    function resetBoard() {        
        if (currentPlayer === players[1]) switchPlayer();
        const boardToReset = board.getBoard();
        const clearCells = boardToReset.map((row) => row.map((cell) => cell.addMarker(0)));        
    }

    return { playRound, getCurrentPlayer, getBoard: board.getBoard, resetBoard, updateName, displayNames };
}

function DisplayController() {
    const game = GameController();      
    const buttonBoard = document.getElementById("button-board");    
    const board = game.getBoard();
    const names = game.displayNames();
    const rename = game.updateName();
    const turnDiv = document.getElementById("current-turn");

    function updateBoard() {
        buttonBoard.innerHTML = "";
        const currentPlayer = game.getCurrentPlayer();        
        turnDiv.textContent = `${currentPlayer.playerName}'s turn. (${currentPlayer.sign})`

        board.forEach((row, index) => {
            const rowData = index;
            row.forEach((cell, column) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.classList.add("square");
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

    // Listen for player clicks
    function boardListener(event) {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;        
        if (!selectedColumn) return;
        if (!selectedRow) return;
        const status = game.playRound(selectedRow, selectedColumn);
        updateBoard();      
        // If game is over (playRound is not true)
        if (!status) {
            buttonBoard.removeEventListener("click", boardListener);
            const gameSquares = document.getElementsByClassName("cell");            
            Array.from(gameSquares).forEach(square => square.classList.remove("square", "occupied"));
            const currentPlayer = game.getCurrentPlayer();
            // False is a win, null is a tie
            if (status === false) {
                turnDiv.textContent = `${currentPlayer.playerName} Wins!`
            } else if (status === null) {
                turnDiv.textContent = "We have a tie!"
            };
        };
    }

    // Reset the board
    function resetGame () {
        game.resetBoard();
        buttonBoard.addEventListener("click", boardListener);
        updateBoard();
    }

    buttonBoard.addEventListener("click", boardListener);
    document.getElementById("reset-board").addEventListener("click", resetGame);

    // Listener for edit buttons
    function editListener(event) {
        const selectedPlayer = event.target.dataset.player;
        if (!selectedPlayer) return;
        const editDiv = document.getElementById(`player-${selectedPlayer}-form`);
        editDiv.style.display = "block";
    }
    const editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach(button => button.addEventListener("click", editListener));   
    
    updateBoard();
    
}

DisplayController();