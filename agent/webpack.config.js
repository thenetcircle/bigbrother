const path = require('path');

const config = {
    entry: './src/export.js',
    output: {
        path: path.resolve(__dirname, '../bigbrother/static'),
        filename: 'bigbrother-agent.js'
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