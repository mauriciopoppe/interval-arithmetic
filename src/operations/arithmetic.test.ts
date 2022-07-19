import Interval, { Interval as _Interval } from '../'
import assert from 'assert'

const EPS = 1e-7
function assertEps(a: number, b: number): void {
  assert(Math.abs(a - b) < EPS)
}

let n

describe('Interval', function () {
  it('should compute interval addition', function () {
    let a
    a = Interval.add(new Interval(-1, 1), new Interval(-1, 1))
    Interval.almostEqual(a, [-2, 2])
    a = Interval.add(new Interval(-1, Infinity), new Interval(0, 1))
    assertEps(a.lo, -1)
    assert(a.hi === Infinity)
  })

  it('should compute interval subtraction', function () {
    let a
    a = Interval.sub(new Interval(-1, 1), new Interval(-1, 1))
    assertEps(a.lo, -2)
    assertEps(a.hi, 2)
    a = Interval.sub(new Interval(5, 7), new Interval(2, 3))
    Interval.almostEqual(a, [2, 5])
    a = Interval.sub(new Interval(-1, Infinity), new Interval(0, 1))
    assertEps(a.lo, -2)
    assert(a.hi === Infinity)
  })

  describe('multiplication', function () {
    it('empty * ?', function () {
      var x = Interval.mul(Interval.EMPTY, Interval.ONE)
      assert(Interval.isEmpty(x))
    })

    it('positive * positive', function () {
      let x
      x = Interval.mul(new Interval(1, 2), new Interval(2, 3))
      assertEps(x.lo, 2)
      assertEps(x.hi, 6)
      x = Interval.mul(new Interval(1, Infinity), new Interval(4, 6))
      assertEps(x.lo, 4)
      assert(x.hi === Infinity)

      x = Interval.mul(new Interval(1, Infinity), new Interval(Infinity, Infinity))
      assert(x.lo === Infinity)
      assert(x.hi === Infinity)
    })

    it('positive * negative', function () {
      let x
      x = Interval.mul(new Interval(1, 2), new Interval(-3, -2))
      assertEps(x.lo, -6)
      assertEps(x.hi, -2)
      x = Interval.mul(new Interval(1, Infinity), new Interval(-3, -2))
      assert(x.lo === -Infinity)
      assertEps(x.hi, -2)
    })

    it('positive * mixed', function () {
      let x
      x = Interval.mul(new Interval(1, 2), new Interval(-2, 3))
      assertEps(x.lo, -4)
      assertEps(x.hi, 6)
      x = Interval.mul(new Interval(1, Infinity), new Interval(-2, 3))
      assert(x.lo === -Infinity)
      assert(x.hi === Infinity)
    })

    it('positive * zero', function () {
      let x
      x = Interval.mul(new Interval(1, 2), new Interval(0, 0))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
      x = Interval.mul(new Interval(1, Infinity), new Interval(0, 0))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
    })

    it('negative * positive', function () {
      // same test as positive * negative
      let x
      x = Interval.mul(new Interval(-3, -2), new Interval(1, 2))
      assertEps(x.lo, -6)
      assertEps(x.hi, -2)
      x = Interval.mul(new Interval(-3, -2), new Interval(1, Infinity))
      assert(x.lo === -Infinity)
      assertEps(x.hi, -2)
    })

    it('negative * negative', function () {
      // similar as positive * positive
      let x
      x = Interval.mul(new Interval(-2, -1), new Interval(-3, -2))
      assertEps(x.lo, 2)
      assertEps(x.hi, 6)
      x = Interval.mul(new Interval(-Infinity, -1), new Interval(-6, -4))
      assertEps(x.lo, 4)
      assert(x.hi === Infinity)

      x = Interval.mul(new Interval(-Infinity, -1), new Interval(-Infinity, -Infinity))
      assert(x.lo === Infinity)
      assert(x.hi === Infinity)
    })

    it('negative * mixed', function () {
      let x
      x = Interval.mul(new Interval(-2, -1), new Interval(-2, 3))
      assertEps(x.lo, -6)
      assertEps(x.hi, 4)
      x = Interval.mul(new Interval(-Infinity, -1), new Interval(-2, 3))
      assert(x.lo === -Infinity)
      assert(x.hi === Infinity)
    })

    it('negative * zero', function () {
      let x
      x = Interval.mul(new Interval(-2, -1), new Interval(0, 0))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
      x = Interval.mul(new Interval(-Infinity, -1), new Interval(0, 0))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
    })

    it('mixed * positive', function () {
      // same as positive * mixed
      let x
      x = Interval.mul(new Interval(-2, 3), new Interval(1, 2))
      assertEps(x.lo, -4)
      assertEps(x.hi, 6)
      x = Interval.mul(new Interval(-2, 3), new Interval(1, Infinity))
      assert(x.lo === -Infinity)
      assert(x.hi === Infinity)
    })

    it('mixed * negative', function () {
      // same as negative * mixed
      let x
      x = Interval.mul(new Interval(-2, 3), new Interval(-2, -1))
      assertEps(x.lo, -6)
      assertEps(x.hi, 4)
      x = Interval.mul(new Interval(-2, 3), new Interval(-Infinity, -1))
      assert(x.lo === -Infinity)
      assert(x.hi === Infinity)
    })

    it('mixed * mixed', function () {
      let x
      x = Interval.mul(new Interval(-2, 3), new Interval(-1, 4))
      assertEps(x.lo, -8)
      assertEps(x.hi, 12)

      x = Interval.mul(new Interval(-Infinity, 3), new Interval(-1, Infinity))
      assert(x.lo === -Infinity)
      assert(x.hi === Infinity)
    })

    it('mixed * zero', function () {
      let x
      x = Interval.mul(new Interval(-2, 1), new Interval(0, 0))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
      x = Interval.mul(new Interval(-Infinity, 1), new Interval(0, 0))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
    })

    it('zero * ?', function () {
      let x
      // mixed
      x = Interval.mul(new Interval(0, 0), new Interval(-2, 1))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
      // negative
      x = Interval.mul(new Interval(0, 0), new Interval(-2, -1))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
      // positive
      x = Interval.mul(new Interval(0, 0), new Interval(1, 2))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
      // zero
      x = Interval.mul(new Interval(0, 0), new Interval(0, 0))
      assertEps(x.lo, 0)
      assertEps(x.hi, 0)
    })
  })

  describe('division', function () {
    it('should consider empty intervals', function () {
      n = Interval.div(Interval.EMPTY, new Interval(-1, 1))
      assert(Interval.isEmpty(n))

      n = Interval.div(new Interval(-1, 1), Interval.ZERO)
      assert(Interval.isEmpty(n))
    })

    describe('containing zero', function () {
      let x

      it('positive / zero', function () {
        // positive / zero
        x = Interval.div(new Interval(1, 2), new Interval(-1, 1))
        assert(x.lo === -Infinity)
        assert(x.hi === Infinity)

        // [0, positive] / [zero, positive]
        x = Interval.div(new Interval(0, 2), new Interval(0, 1))
        assert(x.lo === -Infinity)
        assert(x.hi === Infinity)

        // [0, positive] / [negative, zero]
        x = Interval.div(new Interval(0, 2), new Interval(-1, 0))
        assert(x.lo === -Infinity)
        assert(x.hi === Infinity)

        // [positive, positive] / [zero, positive]
        x = Interval.div(new Interval(1, 2), new Interval(0, 1))
        assertEps(x.lo, 1)
        assert(x.hi === Infinity)

        // [positive, positive] / [negative, zero]
        x = Interval.div(new Interval(1, 2), new Interval(-1, 0))
        assert(x.lo === -Infinity)
        assertEps(x.hi, -1)
      })

      it('negative / zero', function () {
        // negative / zero
        x = Interval.div(new Interval(-2, -1), new Interval(-1, 1))
        assert(x.lo === -Infinity)
        assert(x.hi === Infinity)

        // [negative, zero] / [zero, positive]
        x = Interval.div(new Interval(-2, 0), new Interval(0, 1))
        assert(x.lo === -Infinity) // -2 / 0   O:
        assert(x.hi === Infinity) // -2 / -0  O:

        // [negative, zero] / [negative, zero]
        x = Interval.div(new Interval(-2, 0), new Interval(-1, 0))
        assert(x.lo === -Infinity)
        assert(x.hi === Infinity)

        // [negative, negative] / [zero, positive]
        x = Interval.div(new Interval(-2, -1), new Interval(0, 1))
        assert(x.lo === -Infinity)
        assertEps(x.hi, -1)

        // [negative, negative] / [negative, zero]
        x = Interval.div(new Interval(-2, -1), new Interval(-1, 0))
        assertEps(x.lo, 1)
        assert(x.hi === Infinity)
      })

      it('mixed / zero', function () {
        // mixed / zero
        x = Interval.div(new Interval(-2, 3), new Interval(-1, 1))
        // TODO: this should return two intervals
        assert(x.lo === -Infinity)
        assert(x.hi === Infinity)
      })

      it('zero / zero', function () {
        x = Interval.div(new Interval(0, 0), new Interval(-1, 1))
        assert(x.lo === 0)
        assert(x.hi === 0)

        // [zero] / [negative, zero]
        x = Interval.div(Interval.ZERO, new Interval(-1, 0))
        Interval.almostEqual(x, [0, 0])

        // [zero] / [zero, positive]
        x = Interval.div(Interval.ZERO, new Interval(0, 1))
        Interval.almostEqual(x, [0, 0])
      })
    })

    it('without zero', function () {
      let x
      x = Interval.div(new Interval(1, 2), new Interval(3, 4))
      assertEps(x.lo, 1 / 4)
      assertEps(x.hi, 2 / 3)

      x = Interval.div(new Interval(1, 2), new Interval(3, Infinity))
      assertEps(x.lo, 0)
      assertEps(x.hi, 2 / 3)

      x = Interval.div(new Interval(1, Infinity), new Interval(3, Infinity))
      assertEps(x.lo, 0) // 1 / infinity
      assert(x.hi === Infinity) // infinity / 3

      x = Interval.div(new Interval(-2, -1), new Interval(-4, -3))
      assertEps(x.lo, 1 / 4)
      assertEps(x.hi, 2 / 3)

      x = Interval.div(new Interval(-2, -1), new Interval(-Infinity, -3))
      assertEps(x.lo, 0)
      assertEps(x.hi, 2 / 3)

      x = Interval.div(new Interval(-Infinity, -1), new Interval(-Infinity, -3))
      assertEps(x.lo, 0) // 1 / infinity
      assert(x.lo === -Number.MIN_VALUE)
      assert(x.hi === Infinity) // infinity / 3

      x = Interval.div(new Interval(-2, -1), new Interval(3, 4))
      assertEps(x.lo, -2 / 3)
      assertEps(x.hi, -1 / 4)

      x = Interval.div(new Interval(-2, -1), new Interval(3, 4))
      assertEps(x.lo, -2 / 3)
      assertEps(x.hi, -1 / 4)

      // negative / non zero
      x = Interval.div(new Interval(-2, -1), new Interval(3, 4))
      assertEps(x.lo, -2 / 3)
      assertEps(x.hi, -1 / 4)

      // mixed / non zero positive
      x = Interval.div(new Interval(-2, 1), new Interval(3, 4))
      assertEps(x.lo, -2 / 3)
      assertEps(x.hi, 1 / 3)

      // mixed / non zero negative
      x = Interval.div(new Interval(-2, 1), new Interval(-4, -3))
      assertEps(x.lo, -1 / 3)
      assertEps(x.hi, 2 / 3)

      // positive / non zero positive
      x = Interval.div(new Interval(1, 2), new Interval(3, 4))
      assertEps(x.lo, 1 / 4)
      assertEps(x.hi, 2 / 3)

      // positive / non zero negative
      x = Interval.div(new Interval(1, 2), new Interval(-4, -3))
      assertEps(x.lo, -2 / 3)
      assertEps(x.hi, -1 / 4)
    })
  })

  it('should compute the negative of an interval', function () {
    n = Interval.negative(new Interval(2, 3))
    Interval.almostEqual(n, [-3, -2])
    n = Interval.negative(new Interval(-1, 2))
    Interval.almostEqual(n, [-2, 1])
    n = Interval.negative(new Interval(-3, -2))
    Interval.almostEqual(n, [2, 3])
    n = Interval.negative(Interval.WHOLE)
    assert(Interval.isWhole(n))
  })

  it('should compute the identity of an interval', function () {
    n = Interval.positive(new Interval(2, 3))
    Interval.almostEqual(n, [2, 3])
  })
})
