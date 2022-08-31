import Interval from '../'
import assert from 'assert'

let n

describe('Interval', function () {
  it('should compute the cosine function', function () {
    n = Interval.cos(new Interval(0, 0))
    Interval.almostEqual(n, [1, 1])
    n = Interval.cos(new Interval(0, Math.PI / 2))
    Interval.almostEqual(n, [0, 1])
    n = Interval.cos(new Interval(0, (3 * Math.PI) / 2))
    Interval.almostEqual(n, [-1, 1]) // -1 because it includes Math.PI
    n = Interval.cos(new Interval(Math.PI, (3 * Math.PI) / 2))
    Interval.almostEqual(n, [-1, 0])
    n = Interval.cos(new Interval(-Math.PI, -Math.PI))
    Interval.almostEqual(n, [-1, -1])
    n = Interval.cos(new Interval(-Math.PI, Math.PI))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.cos(new Interval(Math.PI / 2, Math.PI / 2))
    Interval.almostEqual(n, [0, 0])
    n = Interval.cos(new Interval(-Math.PI / 2, -Math.PI / 2))
    Interval.almostEqual(n, [0, 0])
    n = Interval.cos(new Interval(-2 * Math.PI, -Math.PI))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.cos(new Interval((3 * Math.PI) / 2, 3 * Math.PI))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.cos(new Interval(-Math.PI / 2, Math.PI))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.cos(new Interval(Math.PI / 2, Math.PI))
    Interval.almostEqual(n, [-1, 0])
    n = Interval.cos(new Interval(Math.PI / 2, Math.PI))
    Interval.almostEqual(n, [-1, 0])

    // PR 12 (cases involving Infinity)
    n = Interval.cos(new Interval(-Infinity, Infinity))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.cos(new Interval(-Infinity, -Infinity))
    assert(Interval.isEmpty(n))
    n = Interval.cos(new Interval(Infinity, Infinity))
    assert(Interval.isEmpty(n))
  })

  it('should compute the sine function', function () {
    n = Interval.sin(new Interval(0, 0))
    Interval.almostEqual(n, [0, 0])
    n = Interval.sin(new Interval(0, Math.PI / 2))
    Interval.almostEqual(n, [0, 1])
    n = Interval.sin(new Interval(0, (3 * Math.PI) / 2))
    Interval.almostEqual(n, [-1, 1]) // -1 because it includes Math.PI
    n = Interval.sin(new Interval(Math.PI, (3 * Math.PI) / 2))
    Interval.almostEqual(n, [-1, 0])
    n = Interval.sin(new Interval(-Math.PI, -Math.PI))
    Interval.almostEqual(n, [0, 0])
    n = Interval.sin(new Interval(Math.PI / 2, Math.PI / 2))
    Interval.almostEqual(n, [1, 1])
    n = Interval.sin(new Interval(-Math.PI / 2, -Math.PI / 2))
    Interval.almostEqual(n, [-1, -1])

    // negative tests
    n = Interval.sin(new Interval(-Math.PI, 0))
    Interval.almostEqual(n, [-1, 0])
    n = Interval.sin(new Interval(-2 * Math.PI, (-3 * Math.PI) / 2))
    Interval.almostEqual(n, [0, 1])
    var p = 2 * Math.PI
    n = Interval.sin(new Interval(-5 * p - 2 * Math.PI, -5 * p - (3 * Math.PI) / 2))
    Interval.almostEqual(n, [0, 1])

    // PR 12: Infinity cases
    n = Interval.sin(new Interval(-Infinity, Infinity))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.sin(new Interval(-Infinity, -Infinity))
    assert(Interval.isEmpty(n))
    n = Interval.sin(new Interval(Infinity, Infinity))
    assert(Interval.isEmpty(n))
  })

  it('should compute the tangent function', function () {
    n = Interval.tan(new Interval(0, 0))
    Interval.almostEqual(n, [0, 0])
    n = Interval.tan(new Interval(Math.PI, Math.PI))
    Interval.almostEqual(n, [0, 0])
    n = Interval.tan(new Interval(-Math.PI, -Math.PI))
    Interval.almostEqual(n, [0, 0])
    n = Interval.tan(new Interval(-Math.PI / 4, Math.PI / 4))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.tan(new Interval((-9 * Math.PI) / 4, (-7 * Math.PI) / 4))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.tan(new Interval((7 * Math.PI) / 4, (9 * Math.PI) / 4))
    Interval.almostEqual(n, [-1, 1])
    n = Interval.tan(new Interval(Math.PI / 2, Math.PI / 2))
    assert(n.lo === Number.NEGATIVE_INFINITY)
    assert(n.hi === Number.POSITIVE_INFINITY)
    n = Interval.tan(new Interval((5 * Math.PI) / 2, (5 * Math.PI) / 2))
    assert(n.lo === Number.NEGATIVE_INFINITY)
    assert(n.hi === Number.POSITIVE_INFINITY)
    n = Interval.tan(new Interval((-5 * Math.PI) / 2, (-5 * Math.PI) / 2))
    assert(n.lo === Number.NEGATIVE_INFINITY)
    assert(n.hi === Number.POSITIVE_INFINITY)
    n = Interval.tan(new Interval(0, Math.PI / 2))
    assert(n.lo === Number.NEGATIVE_INFINITY)
    assert(n.hi === Number.POSITIVE_INFINITY)

    // bug in versions <= 0.2.2
    Interval.almostEqual(Interval.tan(new Interval(-2.975460122699386, -2.955010224948875)), [
      0.16767801556,
      0.18877817478
    ])
    Interval.almostEqual(Interval.tan(new Interval(-Math.PI, -Math.PI)), [0, 0])

    // PR 12: Infinity cases
    n = Interval.tan(new Interval(-Infinity, Infinity))
    assert(Interval.isWhole(n))
    n = Interval.tan(new Interval(-Infinity, -Infinity))
    assert(Interval.isEmpty(n))
  })

  it('should compute the tan issue #16', function () {
    Interval.round.disable()
    n = Interval.tan(new Interval(Math.PI / 2, Math.PI / 2))
    assert(n.lo === Number.NEGATIVE_INFINITY)
    assert(n.hi === Number.POSITIVE_INFINITY)
    Interval.round.enable()
  })

  it('should compute the asin function', function () {
    n = Interval.asin(new Interval(0, 0))
    Interval.almostEqual(n, [0, 0])
    n = Interval.asin(new Interval(-1, 1))
    Interval.almostEqual(n, [-1.57079633, 1.57079633])
    n = Interval.asin(new Interval(-10, 10))
    Interval.almostEqual(n, [-1.57079633, 1.57079633])
    n = Interval.asin(new Interval(-10, -10))
    assert(Interval.isEmpty(n))
  })

  it('should compute the acos function', function () {
    n = Interval.acos(new Interval(1, 1))
    Interval.almostEqual(n, [0, 0])
    n = Interval.acos(new Interval(0, 1))
    Interval.almostEqual(n, [0, Math.PI / 2])
    n = Interval.acos(new Interval(-1, 1))
    Interval.almostEqual(n, [0, Math.PI])
    n = Interval.acos(new Interval(-10, 10))
    Interval.almostEqual(n, [0, Math.PI])
    n = Interval.acos(new Interval(-10, -10))
    assert(Interval.isEmpty(n))
  })

  it('should compute the atan function', function () {
    n = Interval.atan(new Interval(0, 0))
    Interval.almostEqual(n, [0, 0])
    n = Interval.atan(new Interval(-1, 1))
    Interval.almostEqual(n, [-0.785398163, 0.785398163])
  })

  it('should compute the hyperbolic sin function', function () {
    n = Interval.sinh(new Interval(0, 0))
    Interval.almostEqual(n, [0, 0])
    n = Interval.sinh(new Interval(-2, 2))
    Interval.almostEqual(n, [-3.62686040785, 3.62686040785])
  })

  it('should compute the hyperbolic cos function', function () {
    n = Interval.cosh(new Interval(0, 0))
    Interval.almostEqual(n, [1, 1])
    n = Interval.cosh(new Interval(-2, 2))
    Interval.almostEqual(n, [1, 3.76219569108])
    n = Interval.cosh(new Interval(-2, -2))
    Interval.almostEqual(n, [3.76219569108, 3.76219569108])
    n = Interval.cosh(new Interval(2, 2))
    Interval.almostEqual(n, [3.76219569108, 3.76219569108])
  })

  it('should compute the hyperbolic tan function', function () {
    n = Interval.tanh(new Interval(0, 0))
    Interval.almostEqual(n, [0, 0])
    n = Interval.tanh(new Interval(-4, 4))
    Interval.almostEqual(n, [-0.99932929973, 0.99932929973])
    n = Interval.tanh(new Interval(-Infinity, Infinity))
    Interval.almostEqual(n, [-1, 1])
  })
})
