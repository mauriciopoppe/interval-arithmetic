import Interval, { Interval as _Interval } from '../'
import assert from 'assert'
import nextafter from 'nextafter'

describe('Interval', function () {
  let n
  it('should compute the exponent function', function () {
    n = Interval.exp(new Interval(-1, 1))
    Interval.almostEqual(n, [0.36787944117, 2.71828182846])
    n = Interval.exp(new Interval(-3, 3))
    Interval.almostEqual(n, [0.04978706836, 20.0855369232])
  })

  it('should compute the logarithmic function (base exp)', function () {
    n = Interval.log(new Interval(1, 1))
    Interval.almostEqual(n, [0, 0])
    n = Interval.log(new Interval(1, Math.exp(3)))
    Interval.almostEqual(n, [0, 3])
  })

  it('should compute the logarithmic function (base 10)', function () {
    n = Interval.log10(new Interval(1, 1))
    Interval.almostEqual(n, [0, 0])
    n = Interval.log10(new Interval(1, 10))
    Interval.almostEqual(n, [0, 1])
    n = Interval.log10(new Interval(1, 100))
    Interval.almostEqual(n, [0, 2])
  })

  it('should compute the logarithmic function (base 2)', function () {
    n = Interval.log2(new Interval(1, 1))
    Interval.almostEqual(n, [0, 0])
    n = Interval.log2(new Interval(1, 2))
    Interval.almostEqual(n, [0, 1])
    n = Interval.log2(new Interval(1, 8))
    Interval.almostEqual(n, [0, 3])
  })

  it('should compute the hull of two intervals', function () {
    n = Interval.hull(new Interval(-1, 1), new Interval(5, 7))
    Interval.almostEqual(n, [-1, 7])
    n = Interval.hull(new Interval(-1, 1), Interval.EMPTY)
    Interval.almostEqual(n, [-1, 1])
    n = Interval.hull(Interval.EMPTY, new Interval(-1, 1))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.hull(Interval.EMPTY, Interval.EMPTY)
    assert(Interval.isEmpty(n))
  })

  it('should compute the intersection of two intervals', function () {
    n = Interval.intersection(new Interval(-1, 1), new Interval(5, 7))
    assert(Interval.isEmpty(n))
    n = Interval.intersection(new Interval(-1, 1), Interval.EMPTY)
    assert(Interval.isEmpty(n))
    n = Interval.intersection(new Interval(-1, 1), new Interval(0, 7))
    Interval.almostEqual(n, [0, 1])
  })

  it('should compute the union of two intervals', function () {
    n = Interval.union(new Interval(1, 3), new Interval(2, 4))
    Interval.almostEqual(n, [1, 4])

    assert.throws(function () {
      Interval.union(new Interval(1, 2), new Interval(3, 4))
    })
  })

  it('should compute the difference between two intervals', function () {
    n = Interval.difference(new Interval(3, 5), new Interval(4, 6))
    Interval.almostEqual(n, [3, 4])
    n = Interval.difference(new Interval(4, 6), new Interval(3, 5))
    Interval.almostEqual(n, [5, 6])
    n = Interval.difference(new Interval(4, 6), new Interval(8, 9))
    Interval.almostEqual(n, [4, 6])

    // issue #5
    n = Interval.difference(new Interval(0, 3), new Interval(0, 1))
    assert(n.lo > 1)
    assert(n.hi === 3)

    n = Interval.difference(new Interval(0, 3), new Interval(1, 3))
    assert(n.lo === 0)
    assert(n.hi < 1)

    n = Interval.difference(new Interval(0, 3), new Interval(0, 3))
    assert(Interval.isEmpty(n))

    n = Interval.difference(new Interval(0, 1), Interval.EMPTY)
    assert(n.lo === 0)
    assert(n.hi === 1)

    n = Interval.difference(new Interval(0, 1), Interval.WHOLE)
    assert(Interval.isEmpty(n))

    // # 9
    n = Interval.difference(new Interval(0, Infinity), new Interval(0, Infinity))
    assert(Interval.isEmpty(n))
    n = Interval.difference(new Interval(-Infinity, 0), new Interval(-Infinity, 0))
    assert(Interval.isEmpty(n))
    n = Interval.difference(new Interval(-Infinity, 0), Interval.WHOLE)
    assert(Interval.isEmpty(n))
    n = Interval.difference(Interval.WHOLE, Interval.WHOLE)
    assert(Interval.isEmpty(n))

    const a = new Interval(3, nextafter(5, -Infinity))
    const b = new Interval(4, 6)
    n = Interval.difference(a, b)
    assert(n.lo === 3)
    assert(n.hi < 4)
    n = Interval.difference(b, a)
    assert(n.lo === 5)
    assert(n.hi === 6)

    assert.throws(function () {
      Interval.difference(new Interval(1, 4), new Interval(2, 3))
    })
  })

  it('should compute the abs value of an interval', function () {
    n = Interval.abs(new Interval(-1, 1))
    Interval.almostEqual(n, [0, 1])
    n = Interval.abs(new Interval(-3, -2))
    Interval.almostEqual(n, [2, 3])
    n = Interval.abs(new Interval(2, 3))
    Interval.almostEqual(n, [2, 3])
    n = Interval.abs(Interval.WHOLE)
    Interval.almostEqual(n, Interval.EMPTY)
  })

  it('should compute the max value of two intervals', function () {
    n = Interval.max(new Interval(-1, 1), new Interval(5, 7))
    Interval.almostEqual(n, [5, 7])
    n = Interval.max(Interval.EMPTY, new Interval(-1, 1))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.max(new Interval(-1, 1), Interval.EMPTY)
    Interval.almostEqual(n, [-1, 1])
  })

  it('should compute the min value of two intervals', function () {
    n = Interval.min(new Interval(-1, 1), new Interval(5, 7))
    Interval.almostEqual(n, [-1, 1])
  })

  it('should clone an interval', function () {
    let x = new Interval(0, 1)
    Interval.equal(Interval.clone(x), x)
    x = Interval.clone(Interval.EMPTY)
    assert(Interval.isEmpty(x))
  })

  it('should compute complex operations', function () {
    let x = new Interval(0, 1)
    let res = Interval.add(
      Interval.sin(Interval.exp(x)),
      Interval.sub(
        Interval.tan(x),
        Interval.mul(Interval.div(Interval.ONE, Interval.cos(Interval.PI)), Interval.pow(new Interval(1, 3), 2))
      )
    )
    Interval.almostEqual(res, [1.4107812905029047, 11.557407724654915])

    x = new Interval(-1, -1)
    res = Interval.mul(Interval.sqrt(x), x)
    assert(Interval.isEmpty(Interval.sqrt(x)))
    assert(Interval.isEmpty(res))
  })
})
