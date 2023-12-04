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
        return Array.from(playerBoard.children).filter(element => 
            element.getAttribute('x') === `${x}` && element.getAttribute('y') === `${y}`)[0]
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
        return Array.from(botBoard.children).filter(element => 
            element.getAttribute('x') === `${x}` && element.getAttribute('y') === `${y}`)[0]
    }

    return {element}
})()


const placePlayerShips = (() => {
    const domBoard = document.getElementById('player-board')
    const message = document.getElementById('game-message')
    const playerBoardArray = Array.from(domBoard.children)
    playerShips = [player.carrier, player.battleship, player.destroyer, player.submarine, player.patrolBoat]
    shipColor = ['#F52F57', '#F3752B', '#FFC863', '#59CD90', '#3FA7D6']
    let index = 0
    let shipStart = null
    let potentialEnds = []
    playerBoardArray.forEach(element => element.onclick = () => {setShipStart(element)})
    message.textContent = `Select a space to set the starting point of your ${playerShips[index].name}`

    const hasPotentialEnds = () => {
        if (potentialEnds.length > 0) return true
        return false
    }

    const isObstructed = (start, end) => {
        const startX = +start.getAttribute('x')
        const startY = +start.getAttribute('y')
        const endX = +end.getAttribute('x')
        const endY = +end.getAttribute('y')
        if (startY>endY) {
            const x = startX
            for (let y = startY; y >= endY; y--) {
                if (playerDomBoard.element(x,y).space.ship !== null) return true
            }
        } else if (startY<endY) {
            const x = startX
            for (let y = startY; y <= endY; y++) {
                if (playerDomBoard.element(x,y).space.ship !== null) return true
            }
        } else if (startX>endX) {
            const y = startY
            for (let x = startX; x >= endX; x--) {
                if (playerDomBoard.element(x,y).space.ship !== null) return true
            }
        } else if (startX<endX) {
            const y = startY
            for (let x = startX; x <= endX; x++) {
                if (playerDomBoard.element(x,y).space.ship !== null) return true
            }
        }
        return false
    }

    const highlightPotentialEnds = (element) => {
        element.style.backgroundColor = "gray"
        potentialEnds.forEach(element => element.style.backgroundColor = "lightgray")
    }

    const setShipStart = (element) => {
        const x = +(element.getAttribute('x'))
        const y = +(element.getAttribute('y'))
        const distance = (playerShips[index].length-1)
        const left = playerDomBoard.element((x-distance),y)
        const down = playerDomBoard.element(x,(y+distance))
        const right = playerDomBoard.element((x+distance),y)
        const up = playerDomBoard.element(x,(y-distance))
        const endOptionArray = [left, down, right, up]
        endOptionArray.forEach(option => {
            if (option !== undefined && option.space.ship === null && isObstructed(element,option) === false) {
                potentialEnds.push(option)
            }
        })
        if(!hasPotentialEnds()) {
            message.textContent = `Your ${playerShips[index].name} would be obstructed here. Please select another space.`
            return
        }
        if(hasPotentialEnds()) {
            highlightPotentialEnds(element)
            shipStart = element
            playerBoardArray.forEach(element => element.onclick = null)
            potentialEnds.forEach(element => element.onclick = () => {setShipEnd(element)})
            message.textContent = `Select a space to set the end point of your ${playerShips[index].name}`
        }
    }
    
    const markAsShip = (start, end) => {
        startY = +start.getAttribute('y')
        startX = +start.getAttribute('x')
        endY = +end.getAttribute('y')
        endX = +end.getAttribute('x')
        potentialEnds.forEach(element => element.style.backgroundColor = "white")
        if (startY>endY) {
            const x = startX
            for (let y = startY; y >= endY; y--) {
                playerDomBoard.element(x,y).space.ship = playerShips[index]
                playerDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        } else if (startY<endY) {
            const x = startX
            for (let y = startY; y <= endY; y++) {
                playerDomBoard.element(x,y).space.ship = playerShips[index]
                playerDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        } else if (startX>endX) {
            const y = startY
            for (let x = startX; x >= endX; x--) {
                playerDomBoard.element(x,y).space.ship = playerShips[index]
                playerDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        } else if (startX<endX) {
            const y = startY
            for (let x = startX; x <= endX; x++) {
                playerDomBoard.element(x,y).space.ship = playerShips[index]
                playerDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        }
    }

    const setShipEnd = (element) => {
        markAsShip(shipStart, element)
        if (index < 4) {
            index++
            shipStart = null
            potentialEnds = []
            playerBoardArray.forEach(element => element.onclick = () => {setShipStart(element)})
            message.textContent = `Select a space to set the starting point of your ${playerShips[index].name}`
        } else if (index === 4) {
            message.textContent = 'all ships are placed!'
        }
    }
})()

const placeBotShips = (() => {
    const domBoard = document.getElementById('bot-board')
    const botBoardArray = Array.from(domBoard.children)
    botShips = [bot.carrier, bot.battleship, bot.destroyer, bot.submarine, bot.patrolBoat]
    shipColor = ['#F52F57', '#F3752B', '#FFC863', '#59CD90', '#3FA7D6']
    let index = 0
    let shipStart = null
    let potentialEnds = []
    let botShipsPlaced = false
    botBoardArray.forEach(element => element.onclick = () => {setShipStart(element)})

    const hasPotentialEnds = () => {
        if (potentialEnds.length > 0) return true
        return false
    }

    const isObstructed = (start, end) => {
        const startX = +start.getAttribute('x')
        const startY = +start.getAttribute('y')
        const endX = +end.getAttribute('x')
        const endY = +end.getAttribute('y')
        if (startY>endY) {
            const x = startX
            for (let y = startY; y >= endY; y--) {
                if (botDomBoard.element(x,y).space.ship !== null) return true
            }
        } else if (startY<endY) {
            const x = startX
            for (let y = startY; y <= endY; y++) {
                if (botDomBoard.element(x,y).space.ship !== null) return true
            }
        } else if (startX>endX) {
            const y = startY
            for (let x = startX; x >= endX; x--) {
                if (botDomBoard.element(x,y).space.ship !== null) return true
            }
        } else if (startX<endX) {
            const y = startY
            for (let x = startX; x <= endX; x++) {
                if (botDomBoard.element(x,y).space.ship !== null) return true
            }
        }
        return false
    }

    const highlightPotentialEnds = (element) => {
        element.style.backgroundColor = "gray"
        potentialEnds.forEach(element => element.style.backgroundColor = "lightgray")
    }

    const setShipStart = (element) => {
        const x = +(element.getAttribute('x'))
        const y = +(element.getAttribute('y'))
        const distance = (playerShips[index].length-1)
        const left = botDomBoard.element((x-distance),y)
        const down = botDomBoard.element(x,(y+distance))
        const right = botDomBoard.element((x+distance),y)
        const up = botDomBoard.element(x,(y-distance))
        const endOptionArray = [left, down, right, up]
        endOptionArray.forEach(option => {
            if (option !== undefined && option.space.ship === null && isObstructed(element,option) === false) {
                potentialEnds.push(option)
            }
        })
        if(!hasPotentialEnds()) {
            return
        }
        if(hasPotentialEnds()) {
            highlightPotentialEnds(element)
            shipStart = element
            botBoardArray.forEach(element => element.onclick = null)
            potentialEnds.forEach(element => element.onclick = () => {setShipEnd(element)})
        }
    }
    
    const markAsShip = (start, end) => {
        startY = +start.getAttribute('y')
        startX = +start.getAttribute('x')
        endY = +end.getAttribute('y')
        endX = +end.getAttribute('x')
        potentialEnds.forEach(element => element.style.backgroundColor = "white")
        if (startY>endY) {
            const x = startX
            for (let y = startY; y >= endY; y--) {
                botDomBoard.element(x,y).space.ship = playerShips[index]
                botDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        } else if (startY<endY) {
            const x = startX
            for (let y = startY; y <= endY; y++) {
                botDomBoard.element(x,y).space.ship = playerShips[index]
                botDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        } else if (startX>endX) {
            const y = startY
            for (let x = startX; x >= endX; x--) {
                botDomBoard.element(x,y).space.ship = playerShips[index]
                botDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        } else if (startX<endX) {
            const y = startY
            for (let x = startX; x <= endX; x++) {
                botDomBoard.element(x,y).space.ship = playerShips[index]
                botDomBoard.element(x,y).style.backgroundColor = shipColor[index]
            }
        }
    }

    const setShipEnd = (element) => {
        markAsShip(shipStart, element)
        if (index < 4) {
            index++
            shipStart = null
            potentialEnds = []
            botBoardArray.forEach(element => element.onclick = () => {setShipStart(element)})
        } else if (index === 4) {
            botShipsPlaced = true
        }
    }

    while (botShipsPlaced === false) {
        let clickableArray = botBoardArray.filter(element => element.onclick !== null)
        clickableArray[Math.floor(Math.random()*clickableArray.length)].click()
    }
})()

// export {ship, space, board, combatant}