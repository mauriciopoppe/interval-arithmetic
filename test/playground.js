/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
var Interval = require('../');

var x = new Interval(0, 1);
var res = Interval.add(
  Interval.sin(Interval.exp(x)),
  Interval.sub(
    Interval.tan(x),
    Interval.mul(
      Interval.div(Interval.ONE, Interval.cos(Interval.PI)),
      Interval.pow(new Interval(1, 3), 2)
    )
  )
);

console.log(res);
