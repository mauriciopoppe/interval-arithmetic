import Interval, { IntervalClass } from '../'
import assert from 'assert'

describe('Interval', function () {
  it('should check empty intervals', function () {
    let a = Interval.EMPTY
    assert(Interval.isEmpty(a))
    a = new Interval()
    a.assign(1, -1)
    assert(Interval.isEmpty(a))
  })

  it('should check whole intervals', function () {
    let a = Interval.WHOLE
    assert(Interval.isWhole(a))
    a = new Interval()
    a.assign(-Infinity, Infinity)
    assert(Interval.isWhole(a))
  })

  it('should check if zero is included in an interval', function () {
    const a = new Interval(-1, 1)
    const b = new Interval(1, 2)
    assert(Interval.zeroIn(a))
    assert(!Interval.zeroIn(b))
  })

  it('should check if a value is included in an interval', function () {
    const a = new Interval(-1, 1)
    assert(Interval.hasValue(a, 1))
    assert(Interval.hasValue(a, 0))
    assert(Interval.hasValue(a, -1))
    assert(!Interval.hasValue(a, 2))
  })

  it('should check if an interval is a subset of another', function () {
    const a = new Interval(-1, 1)
    const b = new Interval(-0.5, 0.5)
    const c = new Interval(0.5, 1.5)
    assert(Interval.hasInterval(b, a))
    assert(!Interval.hasInterval(c, a))
  })

  it('should check if an interval overlaps another', function () {
    const a = new Interval(-1, 1)
    const b = new Interval(-0.5, 0.5)
    const c = new Interval(0.6, 1.5)
    assert(Interval.intervalsOverlap(a, b))
    assert(Interval.intervalsOverlap(a, c))
    assert(!Interval.intervalsOverlap(b, c))
  })

  it('should check if an interval is a singleton', function () {
    const a = new Interval(1, 1)
    assert(Interval.isSingleton(a))
    a.singleton(2)
    assert(Interval.isSingleton(a))
  })
})
