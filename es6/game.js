import {goboard} from "es6/board"
import {connectedComponentLabeler} from "es6/connectedComponentLabeler"

export class game {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.board = new goboard(width,height)
        this.HISTORYLENGTH = 3 //THIS could be very slow if it's too big. Im actuall not sure how big this needs to be. Its possible there is a max value
        this.history = []
    }

    tryToPlaceStone(x,y,color) {
        var error = undefined
        var captures = 0
        var dead = []
        if(this.board.whatsAt(x,y) !== this.board.EMPTY){
            return {error:"Must play in empty spot"}
        }
        if(!this.board.inBounds(x,y)) {
            return {error:"Out of bounds"}
        }
        // make a temporary board to play on. This could be concerning for performance...possibly.
        var tempBoard = this.board.duplicate()
        tempBoard.setXY(x,y,color)
        var libers= this.liberties(tempBoard)
        for(let libt of libers) {
            var possibleSuicide = undefined
            if(libt.liberties.length <= 0) {
                if( libt.value != color) { 
                    dead.push(libt)
                } else { 
                    possibleSuicide = true
                }
            }
        }
        // check for suicide
        if(possibleSuicide) {
            error = "Suicide not permitted"
            for(let d of dead) {
                if(d.value != color) { //this check should be sufficiant
                    error = undefined
                }
            }
        }
        // remove dead
        if(!error){
            captures = this.removeDead(tempBoard, dead)
            //check for repeated KO, by not allowing board to repeat.
            for(let oldboard of this.history) {
                if(tempBoard.isEqualTo(oldboard)) {
                    error = "Board repeated itself"
                }
            }
        }
        // return 
        return{error:error, dead:dead, board:tempBoard, captures:captures}
    }

    removeDead( board, deadGroups) {
        var capturedCount = 0
        for(var dg of deadGroups) {
            for(var stone of dg.group) {
                board.setXY(stone[0], stone[1], board.EMPTY)
                capturedCount++
            }
        }
        return capturedCount
    }

    placeStone(x, y, color) {
        var attempt = this.tryToPlaceStone(x,y,color)
        if(!attempt.error) {
            this.recordHistory( this.board)
            this.board = attempt.board
        } 
        return attempt
    }

    // first find the groups then the liberties for the groups
    liberties(board) {
        var labeler = new connectedComponentLabeler(board.width, board.height, board.squares)
        var components = labeler.connectAll()
        var result = []
        while(components.length > 0) { //no zeroith group
            var comp = components.pop()
            if(comp.value !== board.EMPTY) {
                var group = comp.group
                var liberty = []
                for(var j=0; j<group.length; j++) {
                    var spot = group[j]
                    var x = spot[0]
                    var y = spot[1]
                    if (board.whatsAt(x,y-1) === board.EMPTY) {
                        liberty.push([x,y-1])
                    }
                    if (board.whatsAt(x,y+1) === board.EMPTY) {
                        liberty.push([x,y+1])
                    }
                    if (board.whatsAt(x-1,y) === board.EMPTY) {
                        liberty.push([x-1,y])
                    }
                    if (board.whatsAt(x+1,y) === board.EMPTY) {
                        liberty.push([x+1,y])
                    }
                }
                comp.liberties = liberty
                result.push(comp)
            }
        }
        return result
    }

    // Store some old boards for comparison. Stores at most this.HISTORYLENGTH 
    recordHistory(board) {
        while( this.history.length >= this.HISTORYLENGTH) {
            this.history.shift()
        }
        this.history.push(board)
    }
}