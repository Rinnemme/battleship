class ship {
    constructor (name, length) {
        this.name = name
        this.length = length
        this.start = null
        this.end = null
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
        this.hits = []
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

class player {
    constructor (name) {
        this.name = name
    }

    attack = (board, x, y) => {
        const target = board.space(x,y)
        if (target.ship === null) {
            target.mark = 'miss'
        } else {
            target.ship.hit()
            target.mark = 'hit'
            board.hits.push(target)
        }
    } 
}

export {ship, space, board, player}