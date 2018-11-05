var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'main', 'bundle')
    },
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'main')
    },
    externals: {
        'react': 'React'
    }
};