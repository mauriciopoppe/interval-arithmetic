/*
 * interval-arithmetic
 *
 * Copyright (c) 2015-2020 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { Interval as IntervalInternal } from './interval'
import round from './round'
import constants from './constants'

import * as relational from './operations/relational'
import * as arithmetic from './operations/arithmetic'
import * as algebra from './operations/algebra'
import * as trigonometric from './operations/trigonometric'
import * as misc from './operations/misc'
import * as utils from './operations/utils'

const Interval = Object.assign(IntervalInternal, constants, round, misc, utils, relational, arithmetic, algebra, trigonometric, { round })

export default Interval
export { Interval }
export * from './operations/relational'
export * from './operations/arithmetic'
export * from './operations/algebra'
export * from './operations/trigonometric'
export * from './operations/misc'
export * from './operations/utils'
export * from './round'
