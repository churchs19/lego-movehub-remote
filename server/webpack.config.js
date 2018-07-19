var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    mode: 'development',
    // the main source code file
    entry: './src/index.ts',
    output: {
        // the output file name
        filename: 'index.js',
        // the output path
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // all files with a `.ts` extension will be handled by `ts-loader`
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    target: 'node',
    externals: nodeModules
};
