const path = require('path');

module.exports = {
    entry: ['@babel/polyfill', './src/main.js'],
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js',
    },
    devServer: {
        static: path.join(__dirname, 'public'),
        compress: true,
        port: 8080,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_module/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    }
}