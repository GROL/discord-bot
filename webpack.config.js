var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = (env, argv) => {
    console.log(argv);

    return {
        watch: argv.mode === 'development',
        entry: path.join(__dirname, 'src', 'index.js'),
        target: 'node',
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'index.js'
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
//                    type: 'javascript/auto',
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                              ["@babel/plugin-proposal-class-properties", { "loose": true }]
                            ]
                        }
                    }
                }
            ]
        },
        stats: {
          warnings: false
        }
    };
};
