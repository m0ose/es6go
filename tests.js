"use strict";

console.log('Hello')
import {goboard} from "es6/board"
import {connectedComponentLabeler} from "es6/connectedComponentLabeler"
import {game} from "es6/game"

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

QUnit.test( "create Go board", function( assert ) {
    var test1 = new goboard(10,10)
    //console.log(test1)
    console.log(test1.toString())
    assert.ok( test1, "Passed!")
})

QUnit.test( "is equal", function( assert ) {
    var b1 = new goboard(10,10)
    var b2 = new goboard(10,10)
    var b3 = new goboard(20,20)
    var test1 = b1.isEqualTo(b2) 
    var test2 = !b1.isEqualTo(b3) 
    assert.ok( test1, "is equal")
    assert.ok( test2, "not equal")
})

QUnit.test( "duplicate board", function( assert ) {
    var b1 = new goboard(10,10)
    var b2 = b1.duplicate()
    var b3 = randomBoard(20,20)
    b3.setXY(4,6,b3.BLACK)
    var b4 = b3.duplicate(20,20)
    var b5 = new goboard(20,20)
    console.log(b3)
    assert.ok( b1.isEqualTo(b2), "duplicate")
    assert.ok( b3.isEqualTo(b4) , "changed value then duplicate")
    assert.ok( !b3.isEqualTo(b5), "changed value changed something at least")
    assert.equal( b3.whatsAt(4,6), b3.BLACK, "setXY and whatsAt xy worked")
})


QUnit.test( "big boards", function( assert ) {
    var b1 = new goboard(1000,1000)
    var b2 = b1.duplicate()
    assert.ok( b1, "big")
    assert.ok( b2, "duplicate")
    assert.ok( b1.isEqualTo(b2), "isequal")
})

QUnit.test( "in bounds", function( assert ) {
    var b1 = new goboard(10,10)
    assert.ok( b1.inBounds(1,1), "1,1")
    assert.ok( b1.inBounds(10,10), "10,10")
    assert.ok( b1.inBounds(1,10), "1,10")
    assert.ok( !b1.inBounds(0,0), "0,0")
    assert.ok( !b1.inBounds(0,1), "0,1")
    assert.ok( !b1.inBounds(11,1), "11,1")
    assert.ok( !b1.inBounds(1,11), "1,11")
})

QUnit.test( "connectedComponentLabeler", function( assert ) {
    var b1 = randomBoard(10,10)
    var c1 = new connectedComponentLabeler(b1.width, b1.height, b1.squares)
    c1.connectAll()
    //console.log(b1.toString())
    //console.log(c1.toString())
    //console.log(c1)
    assert.ok( c1.groups.length > 3, "small board")
    // big board. Just for timing
    var b2 = randomBoard(1000,1000)
    var c2 = new connectedComponentLabeler(b2.width, b2.height, b2.squares)
    c2.connectAll()
    assert.ok( c2.groups.length > 3, "big board")
})

QUnit.test("game liberties", function(assert) {
    var b = new goboard(6,6)
    for(var i=1; i<b.width-1; i++) {
        b.setXY(i,1,b.WHITE)
        b.setXY(i,3,b.BLACK)
        b.setXY(i,4,b.WHITE)
        b.setXY(i,5,b.BLACK)
    }
    console.log('board for liberties test\n', b.toString())
    var g = new game(10,10)
    var libs = g.liberties(b)
    console.log('liberties:', libs)
    assert.equal(libs.length, 4,'length ok')
    assert.equal(libs[3].liberties.length, 6,'top group ok')
    assert.equal(libs[2].liberties.length, 6,'2nd group ok')
    assert.equal(libs[1].liberties.length, 0,'middle group ok')
    assert.equal(libs[0].liberties.length, 6,'bottom group ok')



})