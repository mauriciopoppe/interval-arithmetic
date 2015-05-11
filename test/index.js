/**
 * Created by mauricio on 5/10/15.
 */
'use strict';

require('./double');
require('./round-math');
require('./interval');

describe('interval operations', function () {
  require('./operations/utils');
  require('./operations/arithmetic');
  require('./operations/algebra');
  require('./operations/trigonometric');
  require('./operations/misc');
});
