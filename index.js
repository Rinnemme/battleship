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
            board.hits.unshift(target)
        }
    } 
}

const player = new combatant('player')

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

const bot = new combatant('the bot')

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

// A little 'cheat' function just for fun
const colorBotBoard = () => {
    botboard = document.getElementById('bot-board')
    botBoard = Array.from(botboard.children)
    botBoard.forEach(space => {if (space.space.ship !== null) {space.style.backgroundColor="blue"}})
}

const game = (() => {
    const message = document.getElementById('game-message')
    const domBotBoard = document.getElementById('bot-board')
    const domBotBoardSpaces = Array.from(domBotBoard.children)
    const domPlayerBoard = document.getElementById('player-board')
    const domPlayerBoardSpaces = Array.from(domPlayerBoard.children)
    
    let combatant = bot
    let opponent
    let combatantName
    let opponentPossessive
    let domOpponentBoardSpaces

    const darkened = (color) => {
        if (color === 'rgb(226, 52, 87)') return '#CC2647'
        if (color === 'rgb(243, 117, 43)') return '#D55E19'
        if (color === 'rgb(255, 200, 99)') return '#E6B04B'
        if (color === 'rgb(89, 205, 144)') return '#47B57A'
        if (color === 'rgb(63, 167, 214)') return '#2B90BF'
    }

    const gameOver = () => {
        if (bot.board.hits.length === 17) return true
        else if (player.board.hits.length === 17) return true
        else return false
    }

    const deactivateBoards = () => {
        domPlayerBoardSpaces.forEach(element => element.onclick = null)
        domBotBoardSpaces.forEach(element => element.onclick = null)
    }

    const gameOverMessage = (lastHitElement) => {
        message.style.backgroundColor = combatant === player ? '#167AA9' : '#E23457'
        message.textContent = `${combatantName} sunk ${opponentPossessive} ${lastHitElement.space.ship.name}, and won the game!`
        deactivateBoards()
    }

    const sunkenShipMessage = (element) => {
        message.style.backgroundColor = combatant === player ? '#167AA9' : '#E23457'
        message.textContent = `${combatantName} sunk ${opponentPossessive} ${element.space.ship.name}`
    }

    const colorSunkenShip = (element) => {
        if (combatant === bot) {
            domOpponentBoardSpaces.forEach(space => {if (space.space.ship === element.space.ship) {
                space.style.backgroundColor = 'rgb(150,150,150)'
            }})
        } else (
            domOpponentBoardSpaces.forEach(space => {if (space.space.ship === element.space.ship) {
                space.style.backgroundColor = 'rgb(0,0,0)'
            }})
        )
    }

    const processHit = (combatant, element) => {
        element.style.fontWeight = '800'
        element.textContent = 'X'
        element.style.backgroundColor = combatant === player ? "#E23457" : `${darkened(element.style.backgroundColor)}`
        if (element.space.ship.sunk() === true) {
            if (gameOver()) {
                gameOverMessage(element)
            } else {
                sunkenShipMessage(element)
                opponent.board.spaces.forEach(space => {if(space.ship === element.space.ship) space.mark = 'sunk'})
                colorSunkenShip(element)
            }
        } else message.textContent = `${combatantName} got a hit!`
    }

    const processMiss = (element) => {
        element.textContent = "O"   
        element.style.backgroundColor = combatant === player ? "rgb(70,70,70)" : "rgb(220,220,220)"
        message.textContent = `${combatantName} missed!`
    }

    const strike = (combatant, element) => {
        if (element.space.mark !== null) return
        combatant.attack(opponent.board, +element.getAttribute('x'), +element.getAttribute('y'))
        message.style.backgroundColor = 'rgb(40,40,40)'
        domOpponentBoardSpaces.forEach(element => element.style.fontWeight = '200')
        if (combatant === bot) {domPlayerBoardSpaces.filter(element => element.space.mark === 'miss').forEach(element => {
            element.style.backgroundColor = 'white'
        })}
        if (element.space.mark === 'hit') processHit(combatant, element)
        else if (element.space.mark === 'miss') processMiss(element)
        if (gameOver() === false) game.changeTurn()
    }

    const switchActiveBoard = () => {
        if (combatant === bot) {
            domPlayerBoardSpaces.forEach(element => element.onclick = null)
            const playableArray = domBotBoardSpaces.filter(element => element.space.mark === null)
            playableArray.forEach(element => element.onclick = () => strike(player, element))
            playableArray.forEach(element => element.classList.add('clickable'))
        } else {
            domBotBoardSpaces.forEach(element => element.onclick = null)
            domBotBoardSpaces.forEach(element => element.classList.remove('clickable'))
            const playableArray = domPlayerBoardSpaces.filter(element => element.space.mark === null)
            playableArray.forEach(element => element.onclick = () => strike(bot, element))
        }
    }

    const changeTurn = () => {
        switchActiveBoard()
        combatant = combatant === bot ? player : bot
        combatantName = combatant === player ? 'You' : 'The bot'
        opponentPossessive = combatant === player ? `the bot's` : 'your'
        opponent = combatant === player ? bot : player
        domOpponentBoardSpaces = combatant === player ? domBotBoardSpaces : domPlayerBoardSpaces
        if (combatant === bot)  {
            setTimeout(() => {message.style.backgroundColor = 'rgb(40,40,40)'}, "1000")
            setTimeout(() => {message.textContent = 'The bot is thinking'}, "1000")
            setTimeout(() => {message.textContent += '.'}, "1250")
            setTimeout(() => {message.textContent += '.'}, "1500")
            setTimeout(() => {message.textContent += '.'}, "1750")
            setTimeout(() => {botLogic.takeTurn()}, "2250")
        }
    }

    return {changeTurn, message}
})()

const placePlayerShips = (() => {
    const domBoard = document.getElementById('player-board')
    const domPlayerBoardSpaces = Array.from(domBoard.children)
    domPlayerBoardSpaces.forEach(element => element.classList.add('clickable'))
    playerShips = [player.carrier, player.battleship, player.destroyer, player.submarine, player.patrolBoat]
    shipColor = ['#E23457', '#F3752B', '#FFC863', '#59CD90', '#3FA7D6']
    let index = 0
    let shipStart = null
    let potentialEnds = []
    domPlayerBoardSpaces.forEach(element => element.onclick = () => {setShipStart(element)})
    game.message.textContent = `Select a space to set the starting point of your ${playerShips[index].name}`

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
            game.message.textContent = `Your ${playerShips[index].name} would be obstructed here. Please select another space.`
            return
        }
        if(hasPotentialEnds()) {
            highlightPotentialEnds(element)
            shipStart = element
            domPlayerBoardSpaces.forEach(element => element.onclick = null)
            domPlayerBoardSpaces.forEach(element => element.classList.remove('clickable'))
            potentialEnds.forEach(element => element.onclick = () => {setShipEnd(element)})
            potentialEnds.forEach(element => element.classList.add('clickable'))
            game.message.textContent = `Select a space to set the end point of your ${playerShips[index].name}`
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
            domPlayerBoardSpaces.forEach(element => element.onclick = () => {setShipStart(element)})
            domPlayerBoardSpaces.forEach(element => element.classList.add('clickable'))
            game.message.textContent = `Select a space to set the starting point of your ${playerShips[index].name}`
        } else if (index === 4) {
            game.message.textContent = 'all ships are placed!'
            setTimeout(() => {game.message.textContent = `Now, make your first move by clicking a space on the bot's board`}, "1000")
            domPlayerBoardSpaces.forEach(element => element.classList.remove('clickable'))
            game.changeTurn()
        }
    }
})()

const placeBotShips = (() => {
    const domBoard = document.getElementById('bot-board')
    const domBotBoardSpaces = Array.from(domBoard.children)
    botShips = [bot.carrier, bot.battleship, bot.destroyer, bot.submarine, bot.patrolBoat]
    let index = 0
    let shipStart = null
    let potentialEnds = []
    let botShipsPlaced = false
    domBotBoardSpaces.forEach(element => element.onclick = () => {setShipStart(element)})

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

    const setShipStart = (element) => {
        const x = +(element.getAttribute('x'))
        const y = +(element.getAttribute('y'))
        const distance = (botShips[index].length-1)
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
            shipStart = element
            domBotBoardSpaces.forEach(element => element.onclick = null)
            potentialEnds.forEach(element => element.onclick = () => {setShipEnd(element)})
        }
    }
    
    const markAsShip = (start, end) => {
        startY = +start.getAttribute('y')
        startX = +start.getAttribute('x')
        endY = +end.getAttribute('y')
        endX = +end.getAttribute('x')
        if (startY>endY) {
            const x = startX
            for (let y = startY; y >= endY; y--) {
                botDomBoard.element(x,y).space.ship = botShips[index]
            }
        } else if (startY<endY) {
            const x = startX
            for (let y = startY; y <= endY; y++) {
                botDomBoard.element(x,y).space.ship = botShips[index]
            }
        } else if (startX>endX) {
            const y = startY
            for (let x = startX; x >= endX; x--) {
                botDomBoard.element(x,y).space.ship = botShips[index]
            }
        } else if (startX<endX) {
            const y = startY
            for (let x = startX; x <= endX; x++) {
                botDomBoard.element(x,y).space.ship = botShips[index]
            }
        }
    }

    const setShipEnd = (element) => {
        markAsShip(shipStart, element)
        if (index < 4) {
            index++
            shipStart = null
            potentialEnds = []
            domBotBoardSpaces.forEach(element => element.onclick = () => {setShipStart(element)})
        } else if (index === 4) {
            botShipsPlaced = true
        }
    }

    while (botShipsPlaced === false) {
        let clickableArray = domBotBoardSpaces.filter(element => element.onclick !== null)
        clickableArray[Math.floor(Math.random()*clickableArray.length)].click()
    }
})()

const botLogic = (() => {
    const domPlayerBoard = document.getElementById('player-board')
    const domPlayerBoardSpaces = Array.from(domPlayerBoard.children)

    const clickElement = (space) => {
        const x = space.x
        const y = space.y
        playerDomBoard.element(x,y).click()
    }

    const left = (space) => {
        const x = space.x
        const y = space.y
        return player.board.space((x-1),y)
    }

    const right = (space) => {
        const x = space.x
        const y = space.y
        return player.board.space((x+1),y)
    }

    const up = (space) => {
        const x = space.x
        const y = space.y
        return player.board.space(x,(y-1))
    }

    const down = (space) => {
        const x = space.x
        const y = space.y
        return player.board.space(x,(y+1))
    }
    
    const noAdjacentIsHit = (space) => {
        let result = true
        adjacentSpaces = [left(space), up(space), right(space), down(space)]
        validAdjacentSpaces = adjacentSpaces.filter(option => option !== undefined)
        validAdjacentSpaces.forEach(option => {if(option.mark === 'hit') result = false})
        return result
    }
    
    const firstNullAdjacent = (space) => {
        adjacentSpaces = [left(space), up(space), right(space), down(space)]
        nullAdjacentSpaces = adjacentSpaces.filter(option => option !== undefined && option.mark === null)
        return(nullAdjacentSpaces[0])
    }

    const furthestNonHit = (direction, space) => {
        if (space === undefined || space.mark !== 'hit') return space
        else if (direction === 'left') {
            return furthestNonHit(direction, left(space))
        } else if (direction === 'right') {
            return furthestNonHit(direction, right(space))
        } else if (direction === 'up') {
            return furthestNonHit(direction, up(space))
        } else if (direction === 'down') {
            return furthestNonHit(direction, down(space))
        }
    }

    const considerNextMove = (space) => {
        if (left(space) !== undefined && left(space).mark === 'hit') {
            if (right(space) === undefined || right(space).mark !== null) {
                if (furthestNonHit('left', space) === undefined || furthestNonHit('left', space).mark !== null) clickElement(firstNullAdjacent(space))
                else clickElement(furthestNonHit('left', space))
            } else clickElement(right(space))
        } else if (right(space) !== undefined && right(space).mark === 'hit') {
            if (left(space) === undefined || left(space).mark !== null) {
                if (furthestNonHit('right', space) === undefined || furthestNonHit('right', space).mark !== null) clickElement(firstNullAdjacent(space))
                else clickElement(furthestNonHit('right', space))
            } else clickElement(left(space))
        } else if (up(space) !== undefined && up(space).mark === 'hit') {
            if (down(space) === undefined || down(space).mark !== null) {
                if (furthestNonHit('up', space) === undefined || furthestNonHit('up', space).mark !== null) clickElement(firstNullAdjacent(space))
                else clickElement(furthestNonHit('left', space))
            } else clickElement(down(space))
        } else if (down(space) !== undefined && down(space).mark === 'hit') {
            if (up(space) === undefined || up(space).mark !== null) {
                if (furthestNonHit('down', space) === undefined || furthestNonHit('down', space).mark !== null) clickElement(firstNullAdjacent(space))
                else clickElement(furthestNonHit('down', space))
            } else clickElement(up(space))
        }
    }
    
    const takeTurn = () => {
        const playableArray = domPlayerBoardSpaces.filter(element => element.space.mark === null)
        const unsunkHits = player.board.hits.filter(space => space.ship.sunk() === false)
        if (unsunkHits.length === 0) playableArray[Math.floor(Math.random()*playableArray.length)].click()
        else {
            const lastHit = unsunkHits[0]
            if (noAdjacentIsHit(lastHit) === true) clickElement(firstNullAdjacent(lastHit))
            else considerNextMove(lastHit)
        }
    }

    return {takeTurn}
})()