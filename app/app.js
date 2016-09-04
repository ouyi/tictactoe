'use strict';

var app = angular.module('tictactoe', []);

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
