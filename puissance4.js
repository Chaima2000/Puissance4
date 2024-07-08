class Connect4 {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.currColumns = Array(columns).fill(rows - 1);
        this.currPlayer = 'R';
        this.gameOver = false;
        this.initializeBoard();
        this.renderBoard();
        this.init();
        this.player1Color = "red";
        this.player2Color = "yellow";
        this.initColorSelector();
    }
    initColorSelector() {
        document.getElementById('confirm-color').addEventListener('click', () => {
            const selectedColor = document.getElementById('color-select').value;
            if (this.currPlayer === 'R') {
                this.player1Color = selectedColor;
            } else {
                this.player2Color = selectedColor;
            }
            document.getElementById('color-selection').style.display = 'none';
        });
    }
    init() {
        document.getElementById('rejouer').addEventListener('click', () => this.resetGame());
        document.getElementById('choose-red').addEventListener('click', () => this.chooseColor('R'));
        document.getElementById('choose-yellow').addEventListener('click', () => this.chooseColor('Y'));
        document.getElementById('smaller').addEventListener('click', () => this.smaller());
        document.getElementById('bigger').addEventListener('click', () => this.bigger());
    }

    resetGame() {
        window.location.reload();
    }

    chooseColor(color) {
        if (this.currPlayer === 'R') {
            this.player1Color = color;
        } else {
            this.player2Color = color;
        }
        document.getElementById('color-selection').style.display = 'none';
    }

    smaller() {
        if (this.rows > 4 && this.columns > 4) {
            this.rows--;
            this.columns--;
            this.currColumns = this.currColumns.map(col => Math.min(col, this.rows - 1));
            this.initializeBoard();
            this.renderBoard();
        }
    }

    bigger() {
        if (this.rows < 20 && this.columns < 20) {
            this.rows++;
            this.columns++;
            this.currColumns = Array(this.columns).fill(this.rows - 1);
            this.initializeBoard();
            this.renderBoard();
        }
    }

    initializeBoard() {
        this.board = [];
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                row.push(' ');
            }
            this.board.push(row);
        }
    }

    setPiece(column) {
        if (this.gameOver) {
            return;
        }
    
        let row = this.currColumns[column];
        if (row < 0) {
            return;
        }
    
        this.board[row][column] = this.currPlayer;
        let tile = document.getElementById(row.toString() + '-' + column.toString());
        tile.classList.add(this.currPlayer === 'R' ? 'red-piece' : 'yellow-piece');
        
       
        tile.style.backgroundColor = (this.currPlayer === 'R') ? this.player1Color : this.player2Color;
    
        this.currColumns[column] = row - 1;
    
        this.checkWinner();
        this.switchPlayer();
    }
    

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let r = 0; r < this.rows; r++) {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            for (let c = 0; c < this.columns; c++) {
                const tile = document.createElement('div');
                tile.id = r.toString() + '-' + c.toString();
                tile.classList.add('tile');
                tile.addEventListener('click', () => this.setPiece(c));
                rowElement.appendChild(tile);
            }

            boardElement.appendChild(rowElement);
        }
    }

    // Vérification du gagnant
    checkWinner() {
        if (this.checkDraw()) {
            return;
        }
        // Vérification des lignes
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] !== ' ' &&
                    this.board[r][c] === this.board[r][c + 1] &&
                    this.board[r][c] === this.board[r][c + 2] &&
                    this.board[r][c] === this.board[r][c + 3]) {
                    this.setWinner(r, c);
                    return;
                }
            }
        }

        // Vérification des colonnes
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns; c++) {
                if (this.board[r][c] !== ' ' &&
                    this.board[r][c] === this.board[r + 1][c] &&
                    this.board[r][c] === this.board[r + 2][c] &&
                    this.board[r][c] === this.board[r + 3][c]) {
                    this.setWinner(r, c);
                    return;
                }
            }
        }

        // Vérification des diagonales
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] !== ' ' &&
                    this.board[r][c] === this.board[r + 1][c + 1] &&
                    this.board[r][c] === this.board[r + 2][c + 2] &&
                    this.board[r][c] === this.board[r + 3][c + 3]) {
                    this.setWinner(r, c);
                    return;
                }
            }
        }

        // Vérification des diagonales inversées
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 3; c < this.columns; c++) {
                if (this.board[r][c] !== ' ' &&
                    this.board[r][c] === this.board[r + 1][c - 1] &&
                    this.board[r][c] === this.board[r + 2][c - 2] &&
                    this.board[r][c] === this.board[r + 3][c - 3]) {
                    this.setWinner(r, c);
                    return;
                }
            }
        }

        // Vérification du match nul
        if (this.board.every(row => row.every(cell => cell !== ' '))) {
            this.setDraw();
            return;
        }
    }

    setWinner(row, column) {
        let winnerElement = document.getElementById('winner');
        let winnerColor = this.currPlayer === 'R' ? this.player1Color : this.player2Color;
        winnerElement.innerText = `Le joueur ${winnerColor} a gagné`;
        this.gameOver = true;
    }
    

    setDraw() {
        let winnerElement = document.getElementById('winner');
        winnerElement.innerText = 'Match nul';
        this.gameOver = true;
    }
    checkDraw() {
        // Vérifiez si toutes les cases sont occupées et qu'aucun joueur n'a gagné
        if (this.board.every(row => row.every(cell => cell !== ' '))) {
            this.setDraw();
            return true;
        }
        return false;
    }

    
    switchPlayer() {
        this.currPlayer = (this.currPlayer == 'R') ? 'Y' : 'R';
    }
}

window.onload = function () {
    const connect4Game = new Connect4(6, 7);
};