var fs = require('fs')
var version = require('./package.json').version

var output = fs.createWriteStream('./docs/interval-arithmetic/index.html')
var url = 'https://mauriciopoppe.github.io/interval-arithmetic/' + version + '/'
var str = '<head>'
str += '<meta http-equiv="refresh" content="0; URL=\'' + url + '\'" />'
str += '</head>'

output.write(str)
output.end()

