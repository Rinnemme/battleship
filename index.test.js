import {ship} from './index.js'

test('ship returns an object with length equal to passed parameter', () => {
    const carrier = new ship(5)
    expect(carrier.length).toBe(5)
})

test('hit reduces battleship length by 1', () => {
    const battleship = new ship(4)
    battleship.hit()
    expect(battleship.length).toBe(3)
})

test('sunk returns false if ship length is above 0', () => {
    const titanic = new ship(1)
    expect(titanic.sunk()).toBe(false)
})

test('reducing length to 0 causes sunk to return true', () => {
    const titanic = new ship(1)
    titanic.hit()
    expect(titanic.sunk()).toBe(true)
})