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
    constructor () {
        this.hits = []
        this.spaces = []
        const makeSpaces = (() => {
            for(let y = 1; y <= 10; y++) {
                for (let x = 1; x <= 10; x++) {
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

class combatant {
    constructor (name) {
        this.name = name
        this.board = new board()
        this.carrier = new ship('carrier', 5)
        this.battleship = new ship('battleship', 4)
        this.destroyer = new ship('destroyer', 3)
        this.submarine = new ship('submarine',3)
        this.patrolBoat = new ship('patrol boat', 2)
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

const player = new combatant('player')
const bot = new combatant('bot')

const playerDomBoard = (() => {
    const playerBoard = document.getElementById('player-board')
    for(let y = 1; y <= 10; y++) {
        for(let x = 1; x <= 10; x++) {
            const playerSpace = document.createElement('div')
            playerSpace.classList.add('space')
            playerSpace.setAttribute('x', x)
            playerSpace.setAttribute('y', y)
            playerSpace.space = player.board.space(x,y)
            playerBoard.appendChild(playerSpace)
        }
    }

    const element = (x,y) => {
        return Array.from(playerBoard.children).filter(space => 
            space.getAttribute('x') === `${x}` && space.getAttribute('y') === `${y}`)[0]
    }

    return {element}
})()

const botDomBoard = (() => {
    const botBoard = document.getElementById('bot-board')
    for(let y = 1; y <= 10; y++) {
        for(let x = 1; x <= 10; x++) {
            const botSpace = document.createElement('div')
            botSpace.classList.add('space')
            botSpace.setAttribute('x', x)
            botSpace.setAttribute('y', y)
            botSpace.space = bot.board.space(x,y)
            botBoard.appendChild(botSpace)
        }
    }

    const element = (x,y) => {
        return Array.from(playerBoard.children).filter(space => 
            space.getAttribute('x') === `${x}` && space.getAttribute('y') === `${y}`)[0]
    }

    return {element}
})()



// export {ship, space, board, combatant}