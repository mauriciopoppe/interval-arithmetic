import Interval, { Interval as _Interval } from '../'
import assert from 'assert'

let n

describe('Interval', function () {
  it('should compute the fmod', function () {
    n = Interval.fmod(new Interval(5.3, 5.3), new Interval(2, 2))
    Interval.almostEqual(n, [1.3, 1.3])
    n = Interval.fmod(new Interval(5, 7), new Interval(2, 3))
    Interval.almostEqual(n, [2, 5])
    n = Interval.fmod(new Interval(18.5, 18.5), new Interval(4.2, 4.2))
    Interval.almostEqual(n, [1.7, 1.7])
    n = Interval.fmod(new Interval(-10, -10), new Interval(3, 3))
    Interval.almostEqual(n, [-1, -1])
    n = Interval.fmod(new Interval(), Interval.EMPTY)
    assert(Interval.isEmpty(n))
  })

  it('should compute the fmod (issue #15)', function () {
    // issue #15
    n = Interval.fmod(new Interval(2, 2), new Interval(2, 2))
    Interval.almostEqual(n, [0, 0])
  })

  it('should compute the multiplicative inverse', function () {
    n = Interval.multiplicativeInverse(new Interval(1, 1))
    Interval.almostEqual(n, [1, 1])
    n = Interval.multiplicativeInverse(new Interval(2, 6))
    Interval.almostEqual(n, [1 / 6, 1 / 2])
    n = Interval.multiplicativeInverse(new Interval(-6, -2))
    Interval.almostEqual(n, [-1 / 2, -1 / 6])
    n = Interval.multiplicativeInverse(new Interval(-6, 2))
    assert(n.lo === Number.NEGATIVE_INFINITY)
    assert(n.hi === Number.POSITIVE_INFINITY)
    n = Interval.multiplicativeInverse(new Interval(-6, 0))
    assert(n.lo === Number.NEGATIVE_INFINITY)
    assert(Math.abs((n.hi as number) + 1 / 6) < 1e-7)
    n = Interval.multiplicativeInverse(new Interval(0, 2))
    assert(Math.abs(n.lo - 1 / 2) < 1e-7)
    assert(n.hi === Number.POSITIVE_INFINITY)
    n = Interval.multiplicativeInverse(Interval.ZERO)
    assert(Interval.isEmpty(n))
  })

  it('should compute the power of an interval', function () {
    n = Interval.pow(new Interval(Math.exp(-1), Math.exp(1)), 1)
    Interval.almostEqual(n, [0.36787944117, 2.71828182846])
    n = Interval.pow(new Interval(Math.exp(-1), Math.exp(1)), 3)
    Interval.almostEqual(n, [0.04978706836, 20.0855369232])

    // 0^0
    n = Interval.pow(new Interval(0, 0), 0)
    assert(Interval.isEmpty(n))
    // ?^0
    n = Interval.pow(new Interval(-321, 123), 0)
    Interval.almostEqual(n, [1, 1])

    // negative ^ even
    n = Interval.pow(new Interval(-2, -2), 2)
    Interval.almostEqual(n, [4, 4])
    // negative ^ odd
    n = Interval.pow(new Interval(-2, -2), 3)
    Interval.almostEqual(n, [-8, -8])
    // mixed ^ even
    n = Interval.pow(new Interval(-2, 2), 2)
    Interval.almostEqual(n, [0, 4])
    // mixed ^ odd
    n = Interval.pow(new Interval(-2, 2), 1)
    Interval.almostEqual(n, [-2, 2])
    // positive
    n = Interval.pow(new Interval(1, 1), 1)
    Interval.almostEqual(n, [1, 1])
    n = Interval.pow(new Interval(1, 1), 5)
    Interval.almostEqual(n, [1, 1])
    n = Interval.pow(new Interval(1, 5), 2)
    Interval.almostEqual(n, [1, 25])
    n = Interval.pow(new Interval(2, 5), 2)
    Interval.almostEqual(n, [4, 25])

    // empty^0
    n = Interval.pow(new Interval().setEmpty(), 4)
    assert(Interval.isEmpty(n))

    // with intervals
    n = Interval.pow(new Interval(2, 5), new Interval(2, 2))
    Interval.almostEqual(n, [4, 25])
    n = Interval.pow(new Interval(2, 5), new Interval(1, -1))
    assert(Interval.isEmpty(n))

    // negative power
    n = Interval.pow(new Interval(2, 2), -2)
    Interval.almostEqual(n, [1 / 4, 1 / 4])
    n = Interval.pow(new Interval(2, 3), -2)
    Interval.almostEqual(n, [1 / 9, 1 / 4])
    n = Interval.pow(new Interval(-3, -2), -2)
    Interval.almostEqual(n, [1 / 9, 1 / 4])
    n = Interval.pow(new Interval(2, 3), -3)
    Interval.almostEqual(n, [1 / 27, 1 / 8])
    n = Interval.pow(new Interval(-3, -2), -3)
    Interval.almostEqual(n, [1 / -8, 1 / -27])
    // negative power special cases
    // [zero, positive]
    n = Interval.pow(new Interval(0, 2), -2)
    Interval.almostEqual(n, [1 / 4, Infinity])
    n = Interval.pow(new Interval(0, 2), -3)
    Interval.almostEqual(n, [1 / 8, Infinity])
    // [negative, zero]
    n = Interval.pow(new Interval(-2, 0), -2)
    Interval.almostEqual(n, [1 / 4, Infinity]) // -2^2 = 4, -1^2 = 1
    n = Interval.pow(new Interval(-2, 0), -3)
    Interval.almostEqual(n, [-Infinity, -1 / 8])
    // [negative, positive]
    n = Interval.pow(new Interval(-2, 3), -2)
    Interval.almostEqual(n, [0, Infinity]) // no negative values
    n = Interval.pow(new Interval(-2, 3), -3)
    Interval.almostEqual(n, [-Infinity, Infinity])

    // issue/14
    n = Interval.pow(new Interval(0, 1), -2)
    assert(n.lo < 1)
    assert(Math.abs(n.lo - 1) < 1e-7)
    assert(n.hi === Infinity)
    // issue/14
    n = new Interval().halfOpenLeft(0, 1)
    n = Interval.pow(n, -2)
    assert(n.lo < 1)
    assert(Math.abs(n.lo - 1) < 1e-7)
    assert(n.hi === Infinity)
  })

  it('should compute the square root of an interval', function () {
    n = Interval.sqrt(new Interval(4, 9))
    Interval.almostEqual(n, [2, 3])
    n = Interval.sqrt(new Interval(-4, 9))
    Interval.almostEqual(n, [0, 3])
    n = Interval.sqrt(new Interval(-9, -4))
    assert(Interval.isEmpty(n))
  })

  it('should compute the nth root of an interval', function () {
    // nth root can't be negative
    n = Interval.nthRoot(new Interval(-27, -8), -3)
    assert(Interval.isEmpty(n))

    // [negative, negative] ^ (1 / even power)
    n = Interval.nthRoot(new Interval(-27, -8), 2)
    assert(Interval.isEmpty(n))
    // [negative, negative] ^ (1 / odd power)
    n = Interval.nthRoot(new Interval(-27, -8), 3)
    Interval.almostEqual(n, [-3, -2])
    n = Interval.nthRoot(new Interval(-8, -8), 3)
    Interval.almostEqual(n, [-2, -2])
    // [negative, positive] ^ (1 / even power)
    n = Interval.nthRoot(new Interval(-4, 9), 2)
    Interval.almostEqual(n, [0, 3])
    // [negative, positive] ^ (1 / odd power)
    n = Interval.nthRoot(new Interval(-27, 8), 3)
    Interval.almostEqual(n, [-3, 2])
    // [positive, positive] ^ (1 / even power)
    n = Interval.nthRoot(new Interval(4, 9), 2)
    Interval.almostEqual(n, [2, 3])
    // [positive, positive] ^ (1 / odd power)
    n = Interval.nthRoot(new Interval(8, 27), 3)
    Interval.almostEqual(n, [2, 3])
    n = Interval.nthRoot(new Interval(8, 8), 3)
    Interval.almostEqual(n, [2, 2])

    // n-th root is a interval
    n = Interval.nthRoot(new Interval(-27, -8), new Interval(3, 3))
    Interval.almostEqual(n, [-3, -2])
    n = Interval.nthRoot(new Interval(-27, -8), new Interval(3, 4))
    assert(Interval.isEmpty(n))
  })
})
