'use strict';

var tictactoe = tictactoe || {};

tictactoe.Move = function(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
}

tictactoe.Game = function(rowCount, colCount) {
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.player1 = new tictactoe.Player('x');
    this.player2 = new tictactoe.Player('o');
    this.currentPlayer = this.player1;
    this.moves = [];
    this.gameOver = false;
    this.winningPlayer = undefined;
    this.board = new Array(rowCount);
    for (var i = 0; i < rowCount; i++) {
        this.board[i] = new Array(colCount);
    }
};
tictactoe.Game.prototype = { 
    isValidMove: function(x, y) {
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
            this.moves.push(new tictactoe.Move(x, y, player));
            // TODO: check win / lose / draw
            // TODO: check or change gameOver

            this.currentPlayer = (player === this.player1 ? this.player2 : this.player1);
        }
    }
};

tictactoe.Player = function(symbol) {
    this.symbol = symbol;
}

