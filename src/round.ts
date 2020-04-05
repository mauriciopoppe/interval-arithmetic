import nextafter from 'nextafter'

/**
 * @module interval-arithmetic/round-math
 */

function identity(v: any): any {
  return v
}
function prev(v: number): number {
  if (v === Infinity) {
    return v
  }
  return nextafter(v, -Infinity)
}
function next(v: number): number {
  if (v === -Infinity) {
    return v
  }
  return nextafter(v, Infinity)
}
function toInteger(x: number): number {
  return x < 0 ? Math.ceil(x) : Math.floor(x)
}

/**
 * @alias module:interval-arithmetic/round-math
 */
const round = {
  /**
   * Computes the previous IEEE floating point representation of `v`
   * @example
   * Interval.round.safePrev(1)          // 0.9999999999999999
   * Interval.round.safePrev(3)          // 2.9999999999999996
   * Interval.round.safePrev(Infinity)   // Infinity
   * @param {number} v
   * @return {number}
   * @function
   */
  safePrev: prev,
  /**
   * Computes the next IEEE floating point representation of `v`
   * @example
   * Interval.round.safeNext(1)          // 1.0000000000000002
   * Interval.round.safeNext(3)          // 3.0000000000000004
   * Interval.round.safeNext(-Infinity)  // -Infinity
   * @param {number} v
   * @return {number}
   * @function
   */
  safeNext: next,
  prev: prev,
  next: next,

  // prettier-ignore
  addLo (x: number, y: number): number { return this.prev(x + y) },
  // prettier-ignore
  addHi (x: number, y: number): number { return this.next(x + y) },

  // prettier-ignore
  subLo (x: number, y: number): number { return this.prev(x - y) },
  // prettier-ignore
  subHi (x: number, y: number): number { return this.next(x - y) },

  // prettier-ignore
  mulLo (x: number, y: number): number { return this.prev(x * y) },
  // prettier-ignore
  mulHi (x: number, y: number): number { return this.next(x * y) },

  // prettier-ignore
  divLo (x: number, y: number): number { return this.prev(x / y) },
  // prettier-ignore
  divHi (x: number, y: number): number { return this.next(x / y) },

  // prettier-ignore
  intLo (x: number): number { return toInteger(this.prev(x)) },
  // prettier-ignore
  intHi (x: number): number { return toInteger(this.next(x)) },

  // prettier-ignore
  logLo (x: number): number { return this.prev(Math.log(x)) },
  // prettier-ignore
  logHi (x: number): number { return this.next(Math.log(x)) },

  // prettier-ignore
  expLo (x: number): number { return this.prev(Math.exp(x)) },
  // prettier-ignore
  expHi (x: number): number { return this.next(Math.exp(x)) },

  // prettier-ignore
  sinLo (x: number): number { return this.prev(Math.sin(x)) },
  // prettier-ignore
  sinHi (x: number): number { return this.next(Math.sin(x)) },

  // prettier-ignore
  cosLo (x: number): number { return this.prev(Math.cos(x)) },
  // prettier-ignore
  cosHi (x: number): number { return this.next(Math.cos(x)) },

  // prettier-ignore
  tanLo (x: number): number { return this.prev(Math.tan(x)) },
  // prettier-ignore
  tanHi (x: number): number { return this.next(Math.tan(x)) },

  // prettier-ignore
  asinLo (x: number): number { return this.prev(Math.asin(x)) },
  // prettier-ignore
  asinHi (x: number): number { return this.next(Math.asin(x)) },

  // prettier-ignore
  acosLo (x: number): number { return this.prev(Math.acos(x)) },
  // prettier-ignore
  acosHi (x: number): number { return this.next(Math.acos(x)) },

  // prettier-ignore
  atanLo (x: number): number { return this.prev(Math.atan(x)) },
  // prettier-ignore
  atanHi (x: number): number { return this.next(Math.atan(x)) },

  // polyfill required for hyperbolic functions
  // prettier-ignore
  sinhLo (x: number): number { return this.prev((Math as any).sinh(x)) },
  // prettier-ignore
  sinhHi (x: number): number { return this.next((Math as any).sinh(x)) },

  // prettier-ignore
  coshLo (x: number): number { return this.prev((Math as any).cosh(x)) },
  // prettier-ignore
  coshHi (x: number): number { return this.next((Math as any).cosh(x)) },

  // prettier-ignore
  tanhLo (x: number): number { return this.prev((Math as any).tanh(x)) },
  // prettier-ignore
  tanhHi (x: number): number { return this.next((Math as any).tanh(x)) },

  /**
   * @ignore
   * ln(power) exponentiation of x
   * @param {number} x
   * @param {number} power
   * @returns {number}
   */
  powLo(x: number, power: number): number {
    if (power % 1 !== 0) {
      // power has decimals
      return this.prev(Math.pow(x, power))
    }

    let y = (power & 1) === 1 ? x : 1
    power >>= 1
    while (power > 0) {
      x = round.mulLo(x, x)
      if ((power & 1) === 1) {
        y = round.mulLo(x, y)
      }
      power >>= 1
    }
    return y
  },

  /**
   * @ignore
   * ln(power) exponentiation of x
   * @param {number} x
   * @param {number} power
   * @returns {number}
   */
  powHi(x: number, power: number): number {
    if (power % 1 !== 0) {
      // power has decimals
      return this.next(Math.pow(x, power))
    }

    let y = (power & 1) === 1 ? x : 1
    power >>= 1
    while (power > 0) {
      x = round.mulHi(x, x)
      if ((power & 1) === 1) {
        y = round.mulHi(x, y)
      }
      power >>= 1
    }
    return y
  },

  // prettier-ignore
  sqrtLo(x: number) { return this.prev(Math.sqrt(x)) },
  // prettier-ignore
  sqrtHi(x: number) { return this.next(Math.sqrt(x)) },

  /**
   * Most operations on intervals will cary the rounding error so that the
   * resulting interval correctly represents all the possible values, this feature
   * can be disabled by calling this method allowing a little boost in the
   * performance while operating on intervals
   *
   * @see module:interval-arithmetic/round-math.enable
   * @example
   * var x = Interval.add(
   *   Interval(1),
   *   Interval(1)
   * )
   * x // equal to {lo: 1.9999999999999998, hi: 2.0000000000000004}
   *
   * Interval.round.disable()
   * var y = Interval.add(
   *   Interval(1),
   *   Interval(1)
   * )
   * y // equal to {lo: 2, hi: 2}
   * @function
   */
  disable() {
    this.next = this.prev = identity
  },

  /**
   * Enables IEEE previous/next floating point wrapping of values (enabled by
   * default)
   * @see module:interval-arithmetic/round-math.disable
   * @example
   * var x = Interval.add(
   *   Interval(1),
   *   Interval(1)
   * )
   * x // equal to {lo: 1.9999999999999998, hi: 2.0000000000000004}
   *
   * Interval.round.disable()
   * var y = Interval.add(
   *   Interval(1),
   *   Interval(1)
   * )
   * y // equal to {lo: 2, hi: 2}
   *
   * Interval.round.enable()
   * var z = Interval.add(
   *   Interval(1),
   *   Interval(1)
   * )
   * z // equal to {lo: 1.9999999999999998, hi: 2.0000000000000004}
   * @function
   */
  enable() {
    this.next = next
    this.prev = prev
  }
}

export default round
