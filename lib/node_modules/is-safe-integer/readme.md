# is-safe-integer [![Build Status](https://travis-ci.org/sindresorhus/is-safe-integer.svg?branch=master)](https://travis-ci.org/sindresorhus/is-safe-integer)

> ES6 [`Number.isSafeInteger()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger) ponyfill

> Ponyfill: A polyfill that doesn't overwrite the native method


## Install

```
$ npm install --save is-safe-integer
```


## Usage

```js
var isSafeInteger = require('is-safe-integer');

isSafeInteger(3);
//=> true

isSafeInteger(100719925474099143523412);
//=> false

isSafeInteger(Infinity);
//=> false
```


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
