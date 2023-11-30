class ship {
    constructor (name, length) {
        this.name = name
        this.length = length
    }
    hit = () => this.length--
    sunk = () => {
        if (this.length > 0) return false
        return true
    }
}

class space {
    constructor (x,y) {
        this.x = x
        this.y = y
        this.ship = null
        this.mark = null
    }
}

class board {
    constructor (name) {
        this.name = name
        this.misses = []
        this.ships = []
        this.spaces = []
        const makeSpaces = (() => {
            for(let x = 1; x <= 10; x++) {
                for (let y = 1; y <= 10; y++) {
                    const newSpace = new space(x,y)
                    this.spaces.push(newSpace)
                }
            }
        })()
    }

    space = (x,y) => {
        return this.spaces.filter(space => space.x === x && space.y === y)[0]
    }
}

export {ship, space, board}