'use strict';

describe('tictactoe isValidMove boundary check', function() {
    it('shall return false if a move exceeds boundary', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 3);
        expect(game.isValidMove(2,2)).toEqual(true);
        expect(game.isValidMove(0,3)).toEqual(false);
        expect(game.isValidMove(3,0)).toEqual(false);
        expect(game.isValidMove(-1,0)).toEqual(false);
    });
});

describe('tictactoe isValidMove duplicates check', function() {
    it('shall return false if the move already exists', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 3);
        expect(game.isValidMove(2,2)).toEqual(true);
        game.addMove(2, 2, new tictactoe.Player('x'));
        expect(game.isValidMove(2,2)).toEqual(false);
    });
});

describe('tictactoe hasWon vertical scan', function() {
    it('shall return true if one player has a vertical sequence', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 4);
        var player = player0;
        var move = new tictactoe.Move(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 1, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 2, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 3, player);
        expect(game.hasWon(move)).toEqual(true);
    });
});

describe('tictactoe hasWon horizontal scan', function() {
    it('shall return true if one player has a horizontal sequence', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 4);
        var player = player0;
        var move = new tictactoe.Move(0, 3, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 3, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(1, 3, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(2, 3, player);
        expect(game.hasWon(move)).toEqual(true);
    });
});

describe('tictactoe hasWon getDiagonalNwSe', function() {
    it('shall return true if one player has won', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 4);
        var player = player0;
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
        move = new tictactoe.Move(2, 3, player);
        expect(game.hasWon(move)).toEqual(false);
    });
});

describe('tictactoe hasWon getDiagonalSwNe', function() {
    it('shall return true if one player has won', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 4);
        var player = player0;
        var move = new tictactoe.Move(0, 2, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 2, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(1, 1, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(2, 0, player);
        expect(game.hasWon(move)).toEqual(true);

        move = new tictactoe.Move(2, 3, player);
        expect(game.hasWon(move)).toEqual(false);
        move = new tictactoe.Move(0, 3, player);
        expect(game.hasWon(move)).toEqual(false);

        game = new tictactoe.Game(player0, player1, 3, 4);
        move = new tictactoe.Move(0, 3, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(1, 2, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(2, 1, player);
        expect(game.hasWon(move)).toEqual(false);
        game.addMove(0, 3, player);
        expect(game.hasWon(move)).toEqual(true);
        move = new tictactoe.Move(2, 3, player);
        expect(game.hasWon(move)).toEqual(false);
        move = new tictactoe.Move(0, 0, player);
        expect(game.hasWon(move)).toEqual(false);
    });
});

describe('tictactoe getDiagonalNwSe', function() {
    it('shall return a diagonal sequence', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 4);
        var player = player0;
        expect(game.getDiagonalNwSe(2, 0)).toEqual([undefined]);
        expect(game.getDiagonalNwSe(1, 2)).toEqual([undefined, undefined, undefined]);
        game.addMove(0, 0, player);
        expect(game.getDiagonalNwSe(0, 0)).toEqual([player, undefined, undefined]);
        game.addMove(0, 1, player);
        game.addMove(1, 2, player);
        expect(game.getDiagonalNwSe(0, 1)).toEqual([player, player, undefined]);
        expect(game.getDiagonalNwSe(1, 0)).toEqual([undefined, undefined]);
        expect(game.getDiagonalNwSe(0, 2)).toEqual([undefined, undefined]);

        game = new tictactoe.Game(player0, player1, 3, 4);
        expect(game.getDiagonalNwSe(2, 0)).toEqual([undefined]);
        expect(game.getDiagonalNwSe(1, 2)).toEqual([undefined, undefined, undefined]);
        game.addMove(0, 1, player);
        game.addMove(1, 2, player);
        expect(game.getDiagonalNwSe(2, 0)).toEqual([undefined]);
        expect(game.getDiagonalNwSe(1, 2)).toEqual([player, player, undefined]);
    });
});

describe('tictactoe getDiagonalSwNe', function() {
    it('shall return a diagonal sequence', function() {
        var player0 = new tictactoe.Player('o');
        var player1 = new tictactoe.Player('x');
        var game = new tictactoe.Game(player0, player1, 3, 4);
        var player = player0;
        expect(game.getDiagonalSwNe(1, 1)).toEqual([undefined, undefined, undefined]);
        game.addMove(0, 0, player);
        expect(game.getDiagonalSwNe(0, 0)).toEqual([player]);
        game.addMove(0, 1, player);
        game.addMove(1, 2, player);
        expect(game.getDiagonalSwNe(0, 1)).toEqual([player, undefined]);
        expect(game.getDiagonalSwNe(2, 0)).toEqual([undefined, undefined, undefined]);
        expect(game.getDiagonalSwNe(0, 3)).toEqual([undefined, player, undefined]);
        expect(game.getDiagonalSwNe(1, 3)).toEqual([undefined, undefined]);
    });
});
