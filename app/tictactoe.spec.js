'use strict';

describe('tictactoe isValidMove boundary check', function() {
    it('shall return false if a move exceeds boundary', function() {
        var game = new tictactoe.Game(3);
        expect(game.isValidMove(2,2)).toEqual(true);
        expect(game.isValidMove(0,3)).toEqual(false);
        expect(game.isValidMove(3,0)).toEqual(false);
        expect(game.isValidMove(-1,0)).toEqual(false);
    });
});

describe('tictactoe isValidMove duplicates check', function() {
    it('shall return false if the move already exists', function() {
        var game = new tictactoe.Game(3);
        expect(game.isValidMove(2,2)).toEqual(true);
        game.addMove(2, 2, new tictactoe.Player(game, 'x'));
        expect(game.isValidMove(2,2)).toEqual(false);
    });
});

