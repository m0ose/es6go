import {goboard} from "es6/board"
import {connectedComponentLabeler} from "es6/connectedComponentLabeler"

export class game {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.board = new goboard(width,height)
    }

    tryToPlay(x,y,color) {
        if(this.board.whatsAt(x,y) !== this.board.EMPTY){
            return {error:"Must play in empty spot"}
        }
        var tempBoard = this.board.duplicate()
        tempBoard.setXY(x,y,color)
        var libers= this.liberties(tempBoard)
        var dead = []
        for(var i=0; i<libers.length; i++ ) {
            var libt = libers[i]
            var possibleSuicide = undefined
            if(libt.liberties.length <= 0) {
                if( libt.value != color) { 
                    dead.push(libt)
                } else { 
                    possibleSuicide = true
                }
            }
        }
        var error = true
        if(possibleSuicide) {
            error = "Suicide not permitted"
            for(var i=0; i<dead.length; i++) {
                var d = dead[i]
                if(d.value != color) {
                    error = false
                }
            }
        }
        return{error:error, dead:dead, board:tempBoard}
    }

    playXY(x,y,color) {
       /* var play = this.tryToPlay(x,y,color)
        if(play.error) {
            throw play.error
        }
        //capture dead stones
        var captureCount = 0
        for(var i=0; i<play.dead.length){
            var stone = play.dead[i]
            this.board.setXY(stone[0], stone[1], this.board.EMPTY)

        }
        */
    }

    // find all of the liberties for the different groups
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
}