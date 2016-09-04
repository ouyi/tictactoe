(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var tictactoe = require("./tictactoe.js")

var app = angular.module('tictactoeApp', []);

app.controller('MainCtrl', ['$scope', '$log', function(scope, logger) {

    var boardCanvas = angular.element( document.querySelector( '#boardCanvas' ) )[0];
    scope.board = {
        gameCount: 0,
        drawCount: 0,
        player0: undefined,
        player1: undefined,
        started: false,
        colCount: 3,
        rowCount: 3,
        goalLength: 3,
        opponent: 'c',
        symbol: 'o',
        timeToStart: 3000,
        aiDelay: 1000,
        width: boardCanvas.width,
        height: boardCanvas.height,
        borderSize: 0,
        textStyle: {
            fontFamily: '"Architects Daughter", cursive',
            fontSize: 50,
            fillColor: 'white',
            justification: 'center'
        }
    };

/*
    scope.$watch('[board.opponent, board.symbol]', function(value) {
        scope.start();
    });
*/

}]);

app.directive('t3board', ['$timeout', '$log', function(timer, logger) { 
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element) {

            function initBoard(board, game, paper, tool) {
                // element.width and element.height can not be used because they are not stable
                var cellLengthX = board.width / game.colCount;
                var cellLengthY = board.height / game.rowCount;

                function makeLine(x1, y1, x2, y2) {
                    var vector = new paper.Point(board.borderSize, board.borderSize);
                    var start = new paper.Point(x1, y1).add(vector);
                    var end = new paper.Point(x2, y2).add(vector);
                    var path = new paper.Path(start, end);
                    path.strokeColor = 'white';
                };

                // horizontal
                for (var i = 1; i < game.rowCount; i++) {
                    makeLine(0, i * cellLengthY, board.width, i * cellLengthY);
                }
                // vertical
                for (var i = 1; i < game.colCount; i++) {
                    makeLine(i * cellLengthX, 0, i * cellLengthX, board.height);
                }

                function makeSymbol(x, y, symbol) {
                    var fontSize = board.textStyle.fontSize;
                    var vector = new paper.Point(board.borderSize, board.borderSize + fontSize / 4);
                    var text = new paper.PointText(new paper.Point((x + 0.5) * cellLengthX, (y + 0.5) * cellLengthY).add(vector));
                    text.content = symbol;
                    text.style = board.textStyle;
                }

                // init tool once so that event handling works after start() without being hidden by the previous tool 
                tool.onMouseDown = function(event) {

                    function playOneMove(x, y, game, board) {
                        makeSymbol(x, y, game.currentPlayer.symbol);
                        game.addMove(x, y, game.currentPlayer);
                        if (game.gameOver) {
                            board.gameCount++;
                            if (game.isDraw) {
                                board.drawCount++;
                            }
                            timer(scope.start, board.timeToStart);
                        } 
                    }

                    var cellX = Math.floor((event.point.x - board.borderSize) / cellLengthX);
                    var cellY = Math.floor((event.point.y - board.borderSize) / cellLengthY);
                    logger.log(cellX + ',' + cellY);
                    if (!game.gameOver && game.isValidMove(cellX, cellY)) {
                        scope.$apply(function() {
                            playOneMove(cellX, cellY, game, board); 
                            if (!game.gameOver && game.currentPlayer instanceof tictactoe.PlayerRand) {
                                var c = game.currentPlayer.nextCell(game);
                                timer(function() {
                                    playOneMove(c.x, c.y, game, board); 
                                }, board.aiDelay);
                            }
                        });
                    }
                }

                paper.view.draw();
            };
            
            scope.start = function() {
                if (!scope.paper) {
                    scope.paper = new paper.PaperScope();
                    // it seems that this line changes the element width and height
                    scope.paper.setup(element[0]);
                    scope.tool = new paper.Tool();
                }
                scope.paper.project.activeLayer.removeChildren();

                if (!scope.board.player0 || !scope.board.player1) {
                    scope.board.player0 = new tictactoe.Player(scope.board.symbol);
                    var symbol = scope.board.player0.symbol === 'o' ? 'x' : 'o'
                    if (scope.board.opponent === 'c') {
                        scope.board.player1 = new tictactoe.PlayerRand(symbol);
                    } else {
                        scope.board.player1 = new tictactoe.Player(symbol);
                    }
                }
                scope.game = new tictactoe.Game(scope.board.player0, scope.board.player1, scope.board.colCount, scope.board.rowCount, scope.board.goalLength);

                initBoard(scope.board, scope.game, scope.paper, scope.tool);
                scope.board.started = true;
            }
            //scope.start();
        }
    };
}]);

},{"./tictactoe.js":2}],2:[function(require,module,exports){
'use strict';

var tictactoe = tictactoe || {};

tictactoe.Player = function(symbol) {
    this.symbol = symbol;
    this.winCount = 0;
}

tictactoe.PlayerRand = function(symbol) {
    tictactoe.Player.call(this, symbol);
}
tictactoe.PlayerRand.prototype = Object.create(tictactoe.Player.prototype, {
    nextCell: {
        value: function(game) {
            var cells = game.availCells();
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }
});
tictactoe.PlayerRand.prototype.constructor = tictactoe.PlayerRand;

tictactoe.Move = function(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
}

tictactoe.Game = function(player0, player1, colCount = 3, rowCount = 3, goalLength = 3) {
    this.player0 = player0;
    this.player1 = player1;
    this.colCount = colCount;
    this.rowCount = rowCount;
    this.goalLength = goalLength;

    this.init();
};
tictactoe.Game.prototype = { 
    init: function() {
        this.currentPlayer = this.player0;
        this.moves = [];
        this.winner = undefined;
        this.gameOver = false;
        this.isDraw = false;
        this.board = new Array(this.colCount);
        for (var i = 0; i < this.colCount; i++) {
            this.board[i] = new Array(this.rowCount);
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
                move.player.winCount++;
            } else if (this.moves.length == this.rowCount * this.colCount) {
                this.gameOver = true;
                this.isDraw = true;
            }
            this.currentPlayer = this.getOpponent(player);
        }
    },
    availCells: function() {
        var res = [];
        for (var x = 0; x < this.board.length; x++) {
            for (var y = 0; y < this.board[x].length; y++) {
                if (this.board[x][y] === undefined) {
                    res.push({x: x, y: y});
                }
            }
        }
        return res;
    },
    hasWon: function(move) {

        var sequences = [];
        // vertical
        sequences.push(this.board[move.x]);
        // horizontal
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
        while(i < this.colCount && j < this.rowCount) {
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
        while(i < this.colCount && j >= 0) {
            res.push(this.board[i][j]); 
            i++;
            j--;
        }
        i = x;
        j = y;
        while(i >= 0 && j < this.rowCount) {
            res.unshift(this.board[i][j]); 
            i--;
            j++;
        }
        return res;
    },
    getOpponent: function(player) {
        return (player === this.player1 ? this.player0 : this.player1);
    }
};

exports.Player = tictactoe.Player;
exports.PlayerRand = tictactoe.PlayerRand;
exports.Game = tictactoe.Game;

},{}]},{},[1]);
