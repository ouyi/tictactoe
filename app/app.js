'use strict';

var app = angular.module('tictactoe', []);

app.controller('MainCtrl', ['$scope', '$log', function(scope, logger) {

    var boardCanvas = angular.element( document.querySelector( '#boardCanvas' ) )[0];
    scope.board = {
        colCount: 3,
        rowCount: 3,
        goalLength: 3,
        opponent: 'c',
        symbol: 'o',
        timeToStart: 3000,
        width: boardCanvas.width,
        height: boardCanvas.height,
        borderSize: 5,
        textStyle: {
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: 80,
            fillColor: 'black',
            justification: 'center'
        }
    };

/*
    scope.$watch('[board.opponent, board.symbol]', function(value) {
        scope.reset();
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
                    path.strokeColor = 'black';
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
                    var text = new paper.PointText(new paper.Point(x, y).add(vector));
                    text.content = symbol;
                    text.style = board.textStyle;
                }

                // init tool once so that event handling works after reset without being hidden by the previous tool 
                tool.onMouseDown = function(event) {
                    var cellX = Math.floor((event.point.x - board.borderSize) / cellLengthX);
                    var cellY = Math.floor((event.point.y - board.borderSize) / cellLengthY);
                    logger.log(cellX + ',' + cellY);
                    if (!game.gameOver && game.isValidMove(cellX, cellY)) {
                        makeSymbol((cellX + 0.5) * cellLengthX, (cellY + 0.5) * cellLengthY, game.currentPlayer.symbol);
                        scope.$apply(function() {
                            game.addMove(cellX, cellY, game.currentPlayer);
                            if (game.gameOver) {
                                timer(scope.reset, board.timeToStart);
                            } else if (game.currentPlayer instanceof tictactoe.PlayerRand) {
                                var c = game.currentPlayer.nextCell(game);
                                makeSymbol((c.x + 0.5) * cellLengthX, (c.y + 0.5) * cellLengthY, game.currentPlayer.symbol);
                                game.addMove(c.x, c.y, game.currentPlayer);
                                if (game.gameOver) {
                                    timer(scope.reset, board.timeToStart);
                                }
                            }
                        });
                    }
                }

                paper.view.draw();
            };
            
            scope.reset = function() {
                if (!scope.paper) {
                    scope.paper = new paper.PaperScope();
                    // it seems that this line changes the element width and height
                    scope.paper.setup(element[0]);
                    scope.tool = new paper.Tool();
                }
                scope.paper.project.activeLayer.removeChildren();
                var player0 = new tictactoe.Player(scope.board.symbol);
                var symbol = player0.symbol === 'o' ? 'x' : 'o'
                var player1;
                if (scope.board.opponent === 'c') {
                    player1 = new tictactoe.PlayerRand(symbol);
                } else {
                    player1 = new tictactoe.Player(symbol);
                }
                scope.game = new tictactoe.Game(player0, player1, scope.board.colCount, scope.board.rowCount, scope.board.goalLength);

                initBoard(scope.board, scope.game, scope.paper, scope.tool);
            }
            //scope.reset();
        }
    };
}]);
