'use strict';

var app = angular.module('tictactoe', []);

app.controller('MainCtrl', ['$scope', '$log', function(scope, logger) {

    var boardCanvas = angular.element( document.querySelector( '#boardCanvas' ) )[0];
    scope.board = {
        width: boardCanvas.width,
        height: boardCanvas.height,
    };

}]);

app.directive('t3board', ['$log', function(logger) { 
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element) {

            function initBoard(element) {
                scope.game = new tictactoe.Game(3, 3);
                var rowCount = scope.game.rowCount;
                var colCount = scope.game.colCount;
                var borderSize = 5;
                var symbolRatio = 0.7;
                // element.width and element.height can not be used because they are not stable
                var boardWidth = scope.board.width;
                var boardHeight = scope.board.height;
                var cellLengthX = boardWidth / rowCount;
                var cellLengthY = boardHeight / rowCount;

                if (!scope.paper) {
                    scope.paper = new paper.PaperScope();
                    // it seems that this line changes the element width and height
                    scope.paper.setup(element);
                }
                paper = scope.paper;
                paper.project.activeLayer.removeChildren();

                function makeLine(x1, y1, x2, y2) {
                    var vector = new paper.Point(borderSize, borderSize);
                    var start = new paper.Point(x1, y1).add(vector);
                    var end = new paper.Point(x2, y2).add(vector);
                    var path = new paper.Path(start, end);
                    path.strokeColor = 'black';
                };

                for (var i = 1; i < rowCount; i++) {
                    // horizontal
                    makeLine(0, i * cellLengthY, boardWidth, i * cellLengthY);
                    // vertical
                    makeLine(i * cellLengthX, 0, i * cellLengthX, boardHeight);
                }

                function makeSymbol(x, y, symbol) {
                    var fontSize = 80;
                    var vector = new paper.Point(borderSize, borderSize + fontSize / 4);
                    //var path = new paper.Path.Circle(new paper.Point(x, y).add(vector), cellLengthX / 2 * symbolRatio);
                    var text = new paper.PointText(new paper.Point(x, y).add(vector));
                    text.content = symbol;
                    text.style = {
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        fontSize: fontSize,
                        fillColor: 'black',
                        justification: 'center'
                    };
                }

                new paper.Tool().onMouseDown = function(event) {
                    logger.log(event.point);
                    var cellX = Math.floor((event.point.x - borderSize) / cellLengthX);
                    var cellY = Math.floor((event.point.y - borderSize) / cellLengthY);
                    logger.log(cellX);
                    logger.log(cellY);
                    if (scope.game.isValidMove(cellX, cellY)) {
                        makeSymbol((cellX + 0.5) * cellLengthX, (cellY + 0.5) * cellLengthY, scope.game.currentPlayer.symbol);
                        scope.$apply(function() {
                            scope.game.addMove(cellX, cellY, scope.game.currentPlayer);
                        });
                    } else {
                        logger.log(cellX);
                        logger.log(cellY);
                    }
                }

                paper.view.draw();
            };
            
            scope.reset = function() {
                initBoard(element[0]);
            }
            scope.reset();
        }
    };
}]);
