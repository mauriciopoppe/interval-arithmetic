import Interval from './'
import assert from 'assert'

let n
const EPS = 1e-7

function assertEps(a: number, b: number): void {
  assert(Math.abs(a - b) < EPS)
}

describe('interval', function () {
  it('should control the parameters it receives on the constructor', function () {

    n = new Interval(1, 2)
    assert(n.lo === 1 && n.hi === 2)

    n = new Interval(1)
    assert(n.lo === 1 && n.hi === 1)

    n = new Interval()
    assert(n.lo === 0 && n.hi === 0)

    n = Interval()
    assert(n.lo === 0 && n.hi === 0)
  })

  it('should have a factory', function () {
    // @ts-ignore
    n = Interval.factory()
    assert(n.lo === 0 && n.hi === 0)
    // @ts-ignore
    n = Interval.factory(1, 5)
    assert(n.lo === 1 && n.hi === 5)
    // @ts-ignore
    n = Interval.factory(1, -1)
    assert(Interval.isEmpty(n))
    // @ts-ignore
    n = Interval.factory(1)
    assert(n.lo === 1 && n.hi === 1)

    // nested
    // @ts-ignore
    n = Interval.factory([1, 2])
    assert(n.lo === 1 && n.hi === 2)

    // @ts-ignore
    n = Interval.factory(Interval.factory(1))
    assert(n.lo === 1 && n.hi === 1)

    // @ts-ignore
    n = Interval.factory(Interval.factory(1), Interval.factory(2))
    assert(n.lo === 1 && n.hi === 2)

    // @ts-ignore
    n = Interval.factory(Interval.factory(0), Interval.factory(3.15))
    assert(n.lo === 0 && n.hi === 3.15)

    assert.throws(function () {
      // @ts-ignore
      Interval.factory('')
    })
    assert.throws(function () {
      // @ts-ignore
      Interval.factory(Interval.factory(1, 2))
    })
    assert.throws(function () {
      // @ts-ignore
      Interval.factory(Interval.factory(1), Interval.factory(1, 2))
    })
  })

  it('should represent empty/whole/one/pi intervals', function () {
    var x
    x = Interval.EMPTY
    assert(x.lo > x.hi)
    x = Interval.WHOLE
    assert(x.lo < x.hi && x.lo === Number.NEGATIVE_INFINITY && x.hi === Number.POSITIVE_INFINITY)
    x = Interval.PI
    assert(x.lo < x.hi)
    assertEps(x.lo, Math.PI)
    assertEps(x.hi, Math.PI)
    x = Interval.E
    assert(x.lo < x.hi)
    assertEps(x.lo, Math.E)
    assertEps(x.hi, Math.E)
  })

  it('should check NaN on assignment', function () {
    let x = new Interval()
    x.assign(NaN, NaN)
    assert(x.lo > x.hi)
    x.assign(1, 2)
    assert(x.lo < x.hi)
  })

  it('should check an invalid interval on assignment', function () {
    var x
    x = new Interval(1, -1)
    assert(x.lo > x.hi)
    x = new Interval()
    x.assign(1, -1)
    assert(x.lo > x.hi)
  })

  it('should assign a singleton to an interval', function () {
    n = new Interval()
    n.singleton(1)
    assert(n.lo === 1 && n.hi === 1)
    n.boundedSingleton(1 / 3)
    assert(n.lo < 1 / 3 && n.hi > 1 / 3)
  })

  it('should assign bounded values to an interval', function () {
    n = new Interval()
    n.bounded(1, 2)
    assert(n.lo < 1 && n.hi > 2)
  })

  it('should compute the array representation of an interval', function () {
    n = new Interval()
    var a = n.toArray()
    assert(a[0] === 0 && a[1] === 0)
  })
})
