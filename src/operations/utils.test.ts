import Interval, { constants, utils } from '../'
import assert from 'assert'

describe('utils', function () {
  it('should check empty intervals', function () {
    let a = constants.EMPTY
    assert(utils.isEmpty(a))
    a = new Interval()
    a.assign(1, -1)
    assert(utils.isEmpty(a))
  })

  it('should check whole intervals', function () {
    let a = constants.WHOLE
    assert(utils.isWhole(a))
    a = new Interval()
    a.assign(-Infinity, Infinity)
    assert(utils.isWhole(a))
  })

  it('should check if zero is included in an interval', function () {
    const a = new Interval(-1, 1)
    const b = new Interval(1, 2)
    assert(utils.zeroIn(a))
    assert(!utils.zeroIn(b))
  })

  it('should check if a value is included in an interval', function () {
    const a = new Interval(-1, 1)
    assert(utils.hasValue(a, 1))
    assert(utils.hasValue(a, 0))
    assert(utils.hasValue(a, -1))
    assert(!utils.hasValue(a, 2))
  })

  it('should check if an interval is a subset of another', function () {
    const a = new Interval(-1, 1)
    const b = new Interval(-0.5, 0.5)
    const c = new Interval(0.5, 1.5)
    assert(utils.hasInterval(b, a))
    assert(!utils.hasInterval(c, a))
  })

  it('should check if an interval overlaps another', function () {
    const a = new Interval(-1, 1)
    const b = new Interval(-0.5, 0.5)
    const c = new Interval(0.6, 1.5)
    assert(utils.intervalsOverlap(a, b))
    assert(utils.intervalsOverlap(a, c))
    assert(!utils.intervalsOverlap(b, c))
  })

  it('should check if an interval is a singleton', function () {
    const a = new Interval(1, 1)
    assert(utils.isSingleton(a))
    a.singleton(2)
    assert(utils.isSingleton(a))
  })
})
