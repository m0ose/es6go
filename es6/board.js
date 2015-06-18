"use strict";

export class goboard {
  constructor(width, height) {
    this.width = width + 2 //pad the borders
    this.height = height + 2
    this.squares = new Int32Array(this.width*this.height)
    // constants
    this.EMPTY=0
    this.BLACK=1
    this.WHITE=2
    this.BORDER=3
    //init
    this._initialize()
  }

  _initialize() {
    for(var y=0; y<this.height; y++){
      for(var x=0; x<this.width; x++){
        if(x<=0 || x>=this.width-1 || y<=0 || y>=this.height-1) {
          this.squares[this.width*y + x] = this.BORDER
        } else {
          this.squares[this.width*y + x] = this.EMPTY
        }
      }
    }
  }

  //board is 1 indexed to allow for borders
  whatsAt(x,y) { 
    return this.squares[this.width*y + x]
  }

  setXY(x, y, value) {
    if(this.inBounds(x,y)) {
      var indx = this.width*y + x
      this.squares[indx] = value
    }
  }

  inBounds(x,y) {
    return x>0 && x<this.width-1 && y>0 && y<this.height-1
  }

  duplicate() {
    var board2 = new goboard(this.width-2, this.height-2) //un-pad borders
    for(var i=0; i<this.squares.length; i++) {
      board2.squares[i] = this.squares[i]
    }
    return board2
  }

  isEqualTo(board2) {
    var passed = true
    if(this.squares.length == board2.squares.length) {
      for(var i=0; i<this.squares.length; i++) {
        if( this.squares[i] !== board2.squares[i]) {
          passed = false
        }
      }
    } else {
      passed = false
    }
    return passed
  }

  toString() {
    var result = ""
    for(var y=0; y<this.height; y++){
      for(var x=0; x<this.width; x++){
        result += this.whatsAt(x,y) + " "
      }
      result += "\n"
    }
    return result
  }
}
