'use strict';

var tictactoe = tictactoe || {};

tictactoe.Player = function(symbol) {
    this.symbol = symbol;
}

tictactoe.Move = function(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
}

tictactoe.Game = function(rowCount, colCount) {
    this.goalLength = 3;
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.player1 = new tictactoe.Player('x');
    this.player2 = new tictactoe.Player('o');
    this.currentPlayer = this.player1;
    this.moves = [];
    this.gameOver = false;
    this.winner = undefined;
    this.board = new Array(rowCount);
    for (var i = 0; i < rowCount; i++) {
        this.board[i] = new Array(colCount);
    }
};
tictactoe.Game.prototype = { 
    isValidMove: function(x, y) {
        if (this.gameOver) {
            return false;
        }
        for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i].x === x && this.moves[i].y === y) {
                console.log("existing");
                return false;
            } 
        }
        return (x >= 0 && x < this.rowCount) && (y >= 0 && y < this.colCount);
    },
    addMove: function(x, y, player) {
        if (!this.gameOver) {
            var move = new tictactoe.Move(x, y, player);
            this.moves.push(move);
            this.board[x][y] = move.player;
            if(this.hasWon(move)) {
                this.winner = move.player; 
                this.gameOver = true;
            } else if (this.moves.length == this.rowCount * this.colCount) {
                this.gameOver = true;
            }
            this.currentPlayer = (player === this.player1 ? this.player2 : this.player1);
        }
    },
    hasWon: function(move) {

        var sequences = [];
        // horizontal
        sequences.push(this.board[move.x]);
        // vertical
        sequences.push(this.board.map(function(value,index) { return value[move.y]; }));
        // diagonal \
        sequences.push(this.getDiagonalBackSlash(move.x, move.y));
        // diagonal /
        sequences.push(this.getDiagonalSlash(move.x, move.y));

        for (var i = 0; i < sequences.length; i++) {
            var count = 0;
            for (var j = 0; j < sequences[i].length; j++) {
                if (sequences[i][j] === move.player) {
                    count ++;
                    if (count === this.goalLength) {
                        return true;
                    }
                } else {
                    count = 0;
                }
            }
        }
        return false;
    },
    getDiagonalBackSlash: function(x, y) {
   
        var res = []; 
        var i = x - Math.max(this.rowCount, this.colCount) + 1;
        var j = y - Math.max(this.rowCount, this.colCount) + 1;
        while(i < this.rowCount && j < this.colCount) {
            if (i >= 0 && j >= 0) {
                res.push(this.board[i][j]); 
            } 
            i++;
            j++;
        }
        return res;
    },
    getDiagonalSlash: function(x, y) {
   
        var res = []; 
        var i = x - Math.max(this.rowCount, this.colCount) + 1;
        var j = y + Math.max(this.rowCount, this.colCount) - 1;
        while(i < this.rowCount && j >= 0 ) {
            if (i >= 0 && j < this.colCount) {
                res.push(this.board[i][j]); 
            } 
            i++;
            j--;
        }
        return res;
    }

};

