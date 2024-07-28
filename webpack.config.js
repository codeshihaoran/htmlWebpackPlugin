const path = require('path');
const HtmlWebpackPlugin = require('./htmlWebpackPlugin')
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'My Webpack App',
            filename: 'index.html',
            template: 'src/template.html',
            inject: 'head',
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
                author: 'Shr',
            },
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
            },
            templateContent: false
        })
    ]
};