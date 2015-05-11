/**
 * Created by mauricio on 5/5/15.
 */
'use strict';

// iee754 double has 64 bits
// its binary representation explained in http://bartaz.github.io/ieee754-visualization/
// can be analyzed with the help of ArrayBuffer, since it has no mechanism to update its
// data a DataView is needed, if the number is divided in 8 chunks of data (each holding 8
// bits)
var bigInteger = require('big-integer');

var buffer = new ArrayBuffer(8);
var dv = new DataView(buffer);
var array8 = new Uint8Array(buffer);
var pow2 = [1, 2, 4, 8, 16, 32, 64, 128];

// from https://github.com/bartaz/ieee754-visualization/blob/master/src/ieee754.js
// float64ToOctets( 123.456 ) -> [ 64, 94, 221, 47, 26, 159, 190, 119 ]
function float64ToOctets(number) {
  dv.setFloat64(0, number, false);
  return [].slice.call( new Uint8Array(buffer) );
}

// from https://github.com/bartaz/ieee754-visualization/blob/master/src/ieee754.js
// octetsToFloat64( [ 64, 94, 221, 47, 26, 159, 190, 119 ] ) -> 123.456
function octetsToFloat64(octets) {
  array8.set(octets);
  return dv.getFloat64(0, false);
}

function octetArrayToBinary(octets) {
  var bin = '';
  for (var i = 0; i < 8; i += 1) {
    for (var j = 7; j >= 0; j -= 1) {
      bin += ( (octets[i] & pow2[j]) > 0 ? '1' : '0');
    }
  }
  return bin;
}

function binaryToOctetArray(bin) {
  var octets = [];
  for (var i = 0; i < 8; i += 1) {
    var n = 0;
    for (var j = 0; j < 8; j += 1) {
      n += (bin[i * 8 + j] === '1' ? pow2[7 - j] : 0 );
    }
    octets.push(n);
  }
  return octets;
}

function doubleToLongBits(n) {
  var octets = float64ToOctets(n);
  return bigInteger(octetArrayToBinary(octets), 2);
}

function longBitsToDouble(n) {
  var nBin = n.toString(2);
  var left = 64 - nBin.length;
  while (left--) {
    nBin = '0' + nBin;
  }
  var octets = binaryToOctetArray(nBin);
  return octetsToFloat64(octets);
}

function solve (a, b) {
  var n = doubleToLongBits(a);
  n = n.add(b);
  return longBitsToDouble(n);
}

exports.doubleToLongBits = doubleToLongBits;
exports.longBitsDoDouble = longBitsToDouble;

exports.ieee754NextDouble = function (n) {
  return solve(n, 1);
};

exports.ieee754PrevDouble = function (n) {
  return solve(n, -1);
};
