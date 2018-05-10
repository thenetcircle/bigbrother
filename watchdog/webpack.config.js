const path = require('path');

const config = {
    entry: './src/watchdog.js',
    output: {
        path: path.resolve(__dirname, '../bigbrother/static'),
        filename: 'watchdog.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};

module.exports = config;