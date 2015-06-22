import {goboard} from "es6/board"
import {connectedComponentLabeler} from "es6/connectedComponentLabeler"

function randomBoard(w,h) {
    var b1 = new goboard(w,h)
    for(var x=1; x<b1.width-1; x++) {
        for(var y=1; y<b1.height-1; y++) {
            var val = Math.floor(Math.random()*3)
            b1.setXY(x,y,val)
        } 
    }
    return b1
}
QUnit.test( "connectedComponentLabeler", function( assert ) {
    var b1 = randomBoard(10,10)
    var c1 = new connectedComponentLabeler(b1.width, b1.height, b1.squares)
    c1.connectAll()
    console.log("_____________connected components /n board:")
    console.log(b1.toString())
    console.log('components:')
    console.log(c1.toString())
    //console.log(c1)
    assert.ok( c1.groups.length > 3, "small board")
    // big board. Just for timing
    var b2 = randomBoard(1000,1000)
    var c2 = new connectedComponentLabeler(b2.width, b2.height, b2.squares)
    c2.connectAll()
    assert.ok( c2.groups.length > 3, "big board")
})
