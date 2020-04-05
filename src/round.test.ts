import Interval, { round } from './'
import assert from 'assert'

let n: number
const EPS = 1e-7

function assertEps(a: number, b: number): void {
  assert(Math.abs(a - b) < EPS)
}

describe('round math', function () {
  describe('should compute next/previous double values of arithmetic operations', function () {
    it('+ addition', function () {
      n = round.addLo(1, 2)
      assert(n < 3)
      assertEps(n, 3)
      n = round.addHi(1, 2)
      assert(n > 3)
      assertEps(n, 3)
    })

    it('- subtraction', function () {
      n = round.subLo(1, 2)
      assert(n < -1)
      assertEps(n, -1)
      n = round.subHi(1, 2)
      assert(n > -1)
      assertEps(n, -1)
    })

    it('* multiplication', function () {
      n = round.mulLo(2, 3)
      assert(n < 6)
      assertEps(n, 6)
      n = round.mulHi(2, 3)
      assert(n > 6)
      assertEps(n, 6)
    })

    it('/ division', function () {
      var d = 2 / 3
      n = round.divLo(2, 3)
      assert(n < d)
      assertEps(n, d)
      n = round.divHi(2, 3)
      assert(n > d)
      assertEps(n, d)
    })
  })

  describe('should compute next/previous double values of algebraic operations', function () {
    it('integer lower', function () {
      n = round.intLo(3.1)
      assert(n === 3)
      n = round.intLo(3)
      assert(n === 2)
      n = round.intLo(-3.1)
      assert(n === -3)
      n = round.intLo(-3)
      assert(n === -3)
      n = round.intLo(0)
      assert(n === 0)
    })

    it('integer upper', function () {
      n = round.intHi(3.1)
      assert(n === 3)
      n = round.intHi(3)
      assert(n === 3)
      n = round.intHi(-3.1)
      assert(n === -3)
      n = round.intHi(-3)
      assert(n === -2)
      n = round.intHi(0)
      assert(n === 0)
    })

    it('^ power', function () {
      var d = 4
      n = round.powLo(2, 2)
      assert(n < d)
      assertEps(n, d)
      n = round.powHi(2, 2)
      assert(n > d)
      assertEps(n, d)
      n = round.powHi(-2, 4)
      assert(n > 16)
      assertEps(n, 16)
      n = round.powHi(2, 3)
      assert(n > 8)
      assertEps(n, 8)
      // getting the prev and then the next number cancels the
      // double rounding
      n = round.powHi(-2, 3)
      assert(n === -8)
      assertEps(n, -8)
    })
  })

  describe('options', function () {
    it('should be disabled/enabled at will', function () {
      round.disable()
      assert(round.prev(2) === 2 && round.next(2) === 2)
      const i = Interval.div(Interval.ONE, new Interval(3, 3))
      assert(i.lo === 1 / 3)
      assert(i.hi === 1 / 3)
      assert(i.lo === i.hi)
      round.enable()
      assert(round.prev(2) < 2 && round.next(2) > 2)
    })
  })
})
