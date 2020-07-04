/*
 * interval-arithmetic
 *
 * Copyright (c) 2015-2020 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { Interval as _Interval } from './interval'
import round from './round'
import constants from './constants'

import * as relational from './operations/relational'
import * as arithmetic from './operations/arithmetic'
import * as algebra from './operations/algebra'
import * as trigonometric from './operations/trigonometric'
import * as misc from './operations/misc'
import * as utils from './operations/utils'

// Object assign only supports 4 union levels
let out1 = Object.assign(constants, round, misc, utils)
let out2 = Object.assign(relational, arithmetic, algebra, trigonometric)
let out = Object.assign(_Interval, out1, out2, { round })

export default out;
export { out as Interval };
export * from './operations/relational'
export * from './operations/arithmetic'
export * from './operations/algebra'
export * from './operations/trigonometric'
export * from './operations/misc'
export * from './operations/utils'
export * from './round'
