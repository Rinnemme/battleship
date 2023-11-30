import {ship, space} from './index.js'

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