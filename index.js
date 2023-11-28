class ship {
    constructor (length) {
        this.length = length
    }
    hit = () => this.length--
    sunk = () => {
        if (this.length > 0) return false
        return true
    }
}

export {ship}