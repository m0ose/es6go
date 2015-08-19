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
    assert.ok( c2.groups.length > 3, "big board 1000x1000")
    //
    var b3 = new goboard(6,6)
    for(var i=1; i<b3.width-1; i++) {
        b3.setXY(i,1,b3.WHITE)
        b3.setXY(i,2,b3.WHITE)
        b3.setXY(i,3,b3.WHITE)
        b3.setXY(i,5,b3.BLACK)
    }
    var c3 = new connectedComponentLabeler(b3.width, b3.height, b3.squares)
    c3.connectAll()
    var centroid = c3.groups[0].centroid()
    assert.equal( centroid[0] , 3.5, "centroid x ok")
    assert.equal( centroid[1] , 2, "centroid y ok")


})
