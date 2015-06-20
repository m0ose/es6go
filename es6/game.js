import {goboard} from "es6/board"
import {connectedComponentLabeler} from "es6/connectedComponentLabeler"

export class game {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.board = new goboard(width,height)
    }

    tryToPlay(x,y,color) {
        // TODO
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