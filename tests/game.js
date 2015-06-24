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

QUnit.test("KO", function(assert) {
    var g = new game(5,4)
    //inital peices
    g.placeStone(1,1,g.board.WHITE)
    g.placeStone(3,2,g.board.BLACK)
    g.placeStone(2,2,g.board.WHITE)
    g.placeStone(4,1,g.board.BLACK)
    g.placeStone(3,1,g.board.WHITE)
    // take first peice
    console.log('_____KO_____')
    console.log('before move 1\n' + g.board.toString())
    var m1 = g.placeStone(2, 1, g.board.BLACK)
    assert.ok( !m1.error, "should not have error. error: " + m1.error)
    assert.equal( m1.captures, 1, "captured a stone: " + m1.captures)
    console.log('after move 1\n' + g.board.toString())
    var b2 = g.board.duplicate()
    //fail to re-take ko 
    var m2 = g.placeStone(3, 1, g.board.WHITE)
    assert.ok( m2.error , "failed re-take of KO: " + m2.error)
    assert.ok( b2.isEqualTo(g.board) , "board didn't change ")
    assert.ok( g.history.length <= g.HISTORYLENGTH, "not leaking history")
    console.log('after move 2\n' + g.board.toString())
    //move somewhere else
    var m3 = g.placeStone(4, 4, g.board.WHITE)
    var m4 = g.placeStone(3, 4, g.board.BLACK)
    // now retake the ko
    var m5 = g.placeStone(3, 1, g.board.WHITE)
    assert.ok( !m5.error , "re-take KO: " + m5.error)
    assert.equal( m5.captures, 1, "1 capture ")
    assert.ok( g.history.length <= g.HISTORYLENGTH, "not leaking history")
    console.log('after move some more moves\n' + g.board.toString())
    //fail to re-take ko 
    var m6 = g.placeStone(2, 1, g.board.BLACK)
    assert.ok( m6.error , "failed re-take of KO: " + m6.error)

    console.log(g)
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

QUnit.test("sgf", function(assert) {
    var shusaku = "(;FF[3]GM[1]SZ[19]PW[Gennan Inseki]WR[8d]PB[Shusaku]BR[4d]KM[0]RE[B+2];B[qd];W[dc];B[pq];W[oc];B[cp];W[cf];B[ep];W[qo];B[pe];W[np];B[po];W[pp];B[op];W[qp];B[oq];W[oo];B[pn];W[qq];B[nq];W[on];B[pm];W[om];B[pl];W[mp];B[mq];W[ol];B[pk];W[lq];B[lr];W[kr];B[lp];W[kq];B[qr];W[rr];B[rs];W[mr];B[nr];W[pr];B[ps];W[qs];B[no];W[mo];B[qr];W[rm];B[rl];W[qs];B[lo];W[mn];B[qr];W[qm];B[or];W[ql];B[qj];W[rj];B[ri];W[rk];B[ln];W[mm];B[qi];W[rq];B[jn];W[ls];B[ns];W[gq];B[go];W[ck];B[kc];W[ic];B[pc];W[nj];B[ke];W[og];B[oh];W[pb];B[qb];W[ng];B[mi];W[mj];B[nd];W[ph];B[qg];W[pg];B[hq];W[hr];B[ir];W[iq];B[hp];W[jr];B[fc];W[lc];B[ld];W[mc];B[lb];W[mb];B[md];W[qf];B[pf];W[qh];B[rg];W[rh];B[sh];W[rf];B[sg];W[pj];B[pi];W[oi];B[oj];W[ni];B[qk];W[ok];B[qe];W[kb];B[jb];W[ka];B[jc];W[ob];B[ja];W[la];B[db];W[cc];B[fe];W[cn];B[gr];W[is];B[fq];W[io];B[ji];W[eb];B[fb];W[eg];B[dj];W[dk];B[ej];W[cj];B[dh];W[ij];B[hm];W[gj];B[eh];W[fl];B[fg];W[er];B[dm];W[fn];B[dn];W[gn];B[jj];W[jk];B[kk];W[ii];B[ik];W[jl];B[kl];W[il];B[jh];W[co];B[do];W[ih];B[hn];W[hl];B[bl];W[dg];B[gh];W[ch];B[ig];W[ec];B[cr];W[fd];B[gd];W[ed];B[gc];W[bk];B[cm];W[gs];B[gp];W[li];B[kg];W[in];B[lj];W[lg];B[gm];W[jf];B[jg];W[im];B[fm];W[kf];B[lf];W[mf];B[le];W[gf];B[hf];W[ff];B[gg];W[lk];B[kj];W[km];B[lm];W[ll];B[jm];W[ge];B[he];W[ef];B[ea];W[cb];B[fr];W[fs];B[dr];W[qa];B[ra];W[pa];B[rb];W[da];B[gi];W[fj];B[fi];W[fa];B[ga];W[gl];B[ek];W[em];B[ho];W[el];B[en];W[jo];B[kn];W[ci];B[lh];W[mh];B[mg];W[di];B[ei];W[lg];B[qn];W[rn];B[re];W[sl];B[mg];W[bm];B[am];W[lg];B[eq];W[es];B[mg];W[ha];B[gb];W[lg];B[ds];W[hs];B[mg];W[sj];B[si];W[lg];B[sr];W[sq];B[mg];W[hd];B[hb];W[lg];B[ro];W[so];B[mg];W[ss];B[qs];W[lg];B[sn];W[rp];B[mg];W[cl];B[bn];W[lg];B[ml];W[mk];B[mg];W[pj];B[sf];W[lg];B[nn];W[nl];B[mg];W[ib];B[ia];W[lg];B[nc];W[nb];B[mg];W[jd];B[kd];W[lg];B[ma];W[na];B[mg];W[qc];B[rc];W[lg];B[js];W[ks];B[mg];W[hc];B[id];W[lg];B[fk];W[hj];B[mg];W[hh];B[hg];W[lg];B[gk];W[hk];B[mg];W[ak];B[lg];W[al];B[bm];W[nf];B[od];W[ki];B[ms];W[kp];B[ip];W[jp];B[lr];W[oj];B[mr];W[ea];B[sr])"
    var g = new game(19,19)
    var plays = parseSGFGhetto(shusaku)
    var score = [0,0,0,0]
    var errors = []
    for(let a of plays) {
        var p = g.placeStone(a.x,a.y,a.c)
        if(p.error){
            errors.push(p.error)
        }
        score[a.c] += p.captures
        //console.log("____"+a.x+","+a.y+'\n' + g.board.toString())
    }
    console.log(score)
    assert.equal(score[g.board.BLACK], 35, "35 captures for black")
    assert.equal(score[g.board.WHITE], 29, "29 captures for white")
    assert.equal(plays.length, 325, "325 moves total")

    assert.equal(errors.length, 0, "no errors")
    console.log('________real game________\n',g.board.toString())
    console.log("errors", errors)

})

function parseSGFGhetto( sgf) {
    var a = sgf.split(';')
    var g = new goboard(1,1)
    var plays = []
    for(var i=2; i<a.length; i++) {
        var x = a[i]
        var c = x[0]
        var color = g.BLACK
        if(c=="W") {
            color = g.WHITE
        }
        var xchar = x[2]
        var xpos = xchar.charCodeAt(0) - "a".charCodeAt(0) + 1
        var ychar = x[3]
        var ypos = ychar.charCodeAt(0) - "a".charCodeAt(0) + 1
        //console.log(c,xchar,xpos, ychar,ypos)
        plays.push({x:xpos, y:ypos, c:color})
    }
    return plays
}