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
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.goalLength = 3;
    this.player0 = new tictactoe.Player('o');
    this.player1 = new tictactoe.Player('x');
    this.currentPlayer = this.player1;
    this.moves = [];
    this.winner = undefined;
    this.gameOver = false;
    this.isDraw = false;
    this.board = new Array(this.rowCount);
    for (var i = 0; i < this.rowCount; i++) {
        this.board[i] = new Array(this.colCount);
    }
};
tictactoe.Game.prototype = { 
    reset: function() {
        this.goalLength = 3;
        this.player0 = new tictactoe.Player('o');
        this.player1 = new tictactoe.Player('x');
        this.currentPlayer = this.player1;
        this.moves = [];
        this.winner = undefined;
        this.gameOver = false;
        this.isDraw = false;
        this.board = new Array(this.rowCount);
        for (var i = 0; i < this.rowCount; i++) {
            this.board[i] = new Array(this.colCount);
        }
    },
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
        return (x >= 0 && x < this.colCount) && (y >= 0 && y < this.rowCount);
    },
    addMove: function(x, y, player) {
        if (!this.gameOver) {
            var move = new tictactoe.Move(x, y, player);
            this.moves.push(move);
            this.board[x][y] = move.player;
            if(this.hasWon(move)) {
                this.gameOver = true;
                this.winner = move.player; 
            } else if (this.moves.length == this.rowCount * this.colCount) {
                this.gameOver = true;
                this.isDraw = true;
            }
            this.currentPlayer = (player === this.player1 ? this.player0 : this.player1);
        }
    },
    hasWon: function(move) {

        var sequences = [];
        // horizontal
        sequences.push(this.board[move.x]);
        // vertical
        sequences.push(this.board.map(function(value,index) { return value[move.y]; }));
        // diagonal \
        sequences.push(this.getDiagonalNwSe(move.x, move.y));
        // diagonal /
        sequences.push(this.getDiagonalSwNe(move.x, move.y));

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
    getDiagonalNwSe: function(x, y) {
   
        var res = []; 
        var i = x - 1;
        var j = y - 1;
        while(i >= 0 && j >= 0) {
            res.unshift(this.board[i][j]); 
            i--;
            j--;
        }
        i = x;
        j = y;
        while(i < this.rowCount && j < this.colCount) {
            res.push(this.board[i][j]); 
            i++;
            j++;
        }
        return res;
    },
    getDiagonalSwNe: function(x, y) {
        var res = []; 
        var i = x + 1;
        var j = y - 1;
        while(i < this.rowCount && j >= 0) {
            res.unshift(this.board[i][j]); 
            i++;
            j--;
        }
        i = x;
        j = y;
        while(i >= 0 && j < this.colCount) {
            res.push(this.board[i][j]); 
            i--;
            j++;
        }
        return res;
    }

};

