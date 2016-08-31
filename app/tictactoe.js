'use strict';

var tictactoe = tictactoe || {};

tictactoe.Move = function(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
}

tictactoe.Game = function(size) {
    this.size = size;
    this.player1 = new tictactoe.Player('x');
    this.player2 = new tictactoe.Player('o');
    this.currentPlayer = this.player1;
    this.moves = [];
};
tictactoe.Game.prototype = { 
    isValidMove: function(x, y) {
        for (var i = 0; i < this.moves.length; i++) {
            if (this.moves[i].x === x && this.moves[i].y === y) {
                console.log("existing");
                return false;
            } 
        }
        return (x >= 0 && x < this.size) && (y >= 0 && y < this.size);
    },
    addMove: function(x, y, player) {
        this.moves.push(new tictactoe.Move(x, y, player));
        // TODO: check win / lose / draw
        this.currentPlayer = (player === this.player1 ? this.player2 : this.player1);
    }
};

tictactoe.Player = function(symbol) {
    this.symbol = symbol;
}

