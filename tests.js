"use strict";

console.log('Hello')
import {goboard} from "es6/board"

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

QUnit.test( "duplicate", function( assert ) {
    var b1 = new goboard(10,10)
    var b2 = b1.duplicate()
    var b3 = new goboard(20,20)
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
    var b1 = new goboard(10000,10000)
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