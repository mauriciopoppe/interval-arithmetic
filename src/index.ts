/*
 * interval-arithmetic
 *
 * Copyright (c) 2015-2020 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { Interval } from './Interval'
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
let out = Object.assign(Interval, out1, out2)

export default out
export { Interval, constants, round, algebra, arithmetic, trigonometric, misc, utils }
