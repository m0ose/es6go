import {goboard} from "es6/board"
import {game} from "es6/game"

QUnit.test("game liberties", function(assert) {
    var b = new goboard(6,6)
    for(var i=1; i<b.width-1; i++) {
        b.setXY(i,1,b.WHITE)
        b.setXY(i,3,b.BLACK)
        b.setXY(i,4,b.WHITE)
        b.setXY(i,5,b.BLACK)
    }
    console.log('_______board for liberties test\n', b.toString())
    var g = new game(10,10)
    var libs = g.liberties(b)
    console.log('liberties:', libs)
    assert.equal(libs.length, 4,'length ok')
    assert.equal(libs[3].liberties.length, 6,'top group ok')
    assert.equal(libs[2].liberties.length, 6,'2nd group ok')
    assert.equal(libs[1].liberties.length, 0,'middle group ok')
    assert.equal(libs[0].liberties.length, 6,'bottom group ok')
})

QUnit.test("play a stone", function(assert) {
    var g = new game(6,5)
    var b = g.board
    b.setXY(1,2,b.BLACK)
    b.setXY(2,1,b.BLACK)
    b.setXY(2,2,b.WHITE)
    b.setXY(3,1,b.WHITE)
    b.setXY(1,3,b.WHITE)
    console.log('_______board place stone 1\n', b.toString())
    var suicide = g.tryToPlaceStone(1,1,b.BLACK)
    assert.ok( suicide.error, "suicide: " + suicide.error)
    var capture = g.tryToPlaceStone(1,1,b.WHITE)
    assert.ok( !capture.error, "capture error: " + capture.error)
    //console.log( capture.board.toString())
    assert.equal( capture.dead.length, 2, "captured stones: " + capture.dead.length)
    //console.log('dead', capture.dead)
    //actually make the PlaceStone
    var capture = g.placeStone(1,1,b.WHITE)
    assert.ok( !capture.error, "actually placed stone error: " + capture.error)
    assert.equal( capture.captures, 2, "captured", capture.captures)
    console.log('after playing at 1,1:')
    console.log( g.board.toString())
})

QUnit.test("play a stone 2", function(assert) {
    var g = new game(4,4)
    var b = g.board
    for(var i=1; i<b.width-1; i++) {
        b.setXY(i,1,b.WHITE)
        b.setXY(i,2,b.WHITE)
        b.setXY(i,3,b.WHITE)
        b.setXY(i,4,b.WHITE)
    }
    b.setXY(2,2,b.EMPTY)
    var occupied1 = g.placeStone(1,1,b.BLACK)
    var occupied2 = g.placeStone(1,1,b.WHITE)
    assert.ok(occupied1.error, "occupied1 "+occupied1.error)
    assert.ok(occupied2.error, "occupied2 "+occupied1.error)
    var suicide = g.placeStone(2,2,b.WHITE)
    assert.ok( suicide.error, "suicide: " + suicide.error)
    console.log('_______board place stone 2________\n', b.toString())
    var capture = g.placeStone(2,2,b.BLACK)
    console.log(capture)
    assert.ok( !capture.error, "should not have error. error: " + capture.error)
    assert.equal( capture.captures, 15, "captured: " + capture.captures)
    console.log('after playing at 2,2:')
    console.log( g.board.toString())
})

QUnit.test("place stone timing", function(assert) {
    var g = new game(19,19)
    var b = g.board
    b.setXY(1,2,b.BLACK)
    b.setXY(2,1,b.BLACK)
    b.setXY(2,2,b.WHITE)
    b.setXY(3,1,b.WHITE)
    b.setXY(1,3,b.WHITE)
    var loopCount = 1000
    var start = new Date().getTime()
    for( var i=0; i < loopCount; i++) {
        var suicide = g.tryToPlaceStone(1,1,b.BLACK)
        var capture = g.tryToPlaceStone(1,1,b.WHITE)
    }
    var end = new Date().getTime()
    assert.ok(true, loopCount + " loops of 19x19")
})