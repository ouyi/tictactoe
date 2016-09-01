'use strict';

describe('tictactoe isValidMove boundary check', function() {
    it('shall return false if a move exceeds boundary', function() {
        var game = new tictactoe.Game(3,3);
        expect(game.isValidMove(2,2)).toEqual(true);
        expect(game.isValidMove(0,3)).toEqual(false);
        expect(game.isValidMove(3,0)).toEqual(false);
        expect(game.isValidMove(-1,0)).toEqual(false);
    });
});

describe('tictactoe isValidMove duplicates check', function() {
    it('shall return false if the move already exists', function() {
        var game = new tictactoe.Game(3,3);
        expect(game.isValidMove(2,2)).toEqual(true);
        game.addMove(2, 2, new tictactoe.Player('x'));
        expect(game.isValidMove(2,2)).toEqual(false);
    });
});

describe('tictactoe hasWon vertical scan', function() {
    it('shall return true if one player has a vertical sequence', function() {
        var game = new tictactoe.Game(3,3);
        var player = new tictactoe.Player('x');
        var move = new tictactoe.Move(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(1, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(2, 0, player);
        expect(game.hasWon(move)).toEqual(true);
    });
});

describe('tictactoe hasWon horizontal scan', function() {
    it('shall return true if one player has a horizontal sequence', function() {
        var game = new tictactoe.Game(3,3);
        var player = new tictactoe.Player('x');
        var move = new tictactoe.Move(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 1, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 2, player);
        expect(game.hasWon(move)).toEqual(true);
    });
});

describe('tictactoe hasWon diagonal backslash', function() {
    it('shall return true if one player has won', function() {
        var game = new tictactoe.Game(3,3);
        var player = new tictactoe.Player('x');
        var move = new tictactoe.Move(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(1, 1, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(2, 2, player);
        expect(game.hasWon(move)).toEqual(true);
        move = new tictactoe.Move(2, 0, player);
        expect(game.hasWon(move)).toEqual(false);
    });
});

describe('tictactoe getDiagonalBackSlash', function() {
    it('shall return a diagonal sequence', function() {
        var game = new tictactoe.Game(3,3);
        expect(game.getDiagonalBackSlash(2, 0)).toEqual([undefined]);
        var player = new tictactoe.Player('x');
        var move = new tictactoe.Move(0, 0, player);
        game.addMove(0, 0, player);
        expect(game.getDiagonalBackSlash(0, 0)).toEqual([player, undefined, undefined]);
        game.addMove(0, 1, player);
        game.addMove(1, 2, player);
        expect(game.getDiagonalBackSlash(0, 1)).toEqual([player, player]);
    });
});

describe('tictactoe getDiagonalSlash', function() {
    it('shall return a diagonal sequence', function() {
        var game = new tictactoe.Game(3,3);
        expect(game.getDiagonalSlash(1, 1)).toEqual([undefined, undefined, undefined]);
        var player = new tictactoe.Player('x');
        var move = new tictactoe.Move(0, 0, player);
        game.addMove(0, 0, player);
        expect(game.getDiagonalSlash(0, 0)).toEqual([player]);
        game.addMove(0, 1, player);
        game.addMove(1, 2, player);
        expect(game.getDiagonalSlash(0, 1)).toEqual([player, undefined]);
    });
});
