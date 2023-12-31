// This file (and TDD) was used while developing the underlying mechanisms beneath the DOM / DOM manipulation.

import {ship, space, board, combatant} from './index.js'

test('ship returns an object with length equal to passed parameter', () => {
    const carrier = new ship('carrier', 5)
    expect(carrier.length).toBe(5)
})

test('hit reduces battleship length by 1', () => {
    const battleship = new ship('battleship', 4)
    battleship.hit()
    expect(battleship.length).toBe(3)
})

test('sunk returns false if ship length is above 0', () => {
    const titanic = new ship('titanic', 1)
    expect(titanic.sunk()).toBe(false)
})

test('reducing length to 0 causes sunk to return true', () => {
    const titanic = new ship('titanic', 1)
    titanic.hit()
    expect(titanic.sunk()).toBe(true)
})

test('space can point to a ship correctly', () => {
    const testSpace = new space(2,3)
    const flagship = new ship('flagship', 7)
    testSpace.ship = flagship
    expect(testSpace.ship.length).toBe(7)
})

test('a space ship pointer updates correctly', () => {
    const testSpace = new space(4,5)
    const testShip = new ship('mini', 1)
    testSpace.ship = testShip
    testShip.hit()
    expect(testSpace.ship.sunk()).toBe(true)
})

test('board constructor makes 100 spaces', () => {
    const playerBoard = new board()
    expect(playerBoard.spaces.length).toBe(100)
})

test('board space method returns space objects with correct key value pairs', () => {
    const playerBoard = new board('player')
    expect(playerBoard.space(2,3)).toMatchObject({x:2, y:3})
})

test('player attack function adjusts the stricken space mark', () => {
    const testBoard = new board()
    const ralph = new combatant('ralph')
    expect(testBoard.space(2,3).mark).toBe(null)
    ralph.attack(testBoard, 2, 3)
    expect(testBoard.space(2,3).mark).not.toBe(null)
})

test('attacking a space that is a ship hits the ship and adds to the board hit array', () => {
    const testBoard = new board()
    testBoard.space(4,5).ship = new ship('battleship',5)
    const ralph = new combatant('ralph')
    expect(testBoard.hits.length).toBe(0)
    ralph.attack(testBoard, 4, 5)
    expect(testBoard.space(4,5).mark).toBe('hit')
    expect(testBoard.space(4,5).ship.length).toBe(4)
    expect(testBoard.hits.length).toBe(1)
})

test('making a player assigns them a board properly', () => {
    const player = new combatant('player')
    expect(player.board.spaces.length).toBe(100)
    expect(player.board.spaces[0]).toMatchObject({x:1, y:1})
    expect(player.board.spaces[99]).toMatchObject({x:10, y:10})
})

test ('mapping a player board space to a player ship reacts correctly', () => {
    const player = new combatant('player')
    expect(player.battleship.length).toBe(4)
    player.battleship.hit()
    expect(player.battleship.length).toBe(3)
})