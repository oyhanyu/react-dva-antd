/**
 * Created by oyhanyu on 2017/7/4.
 */

var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (webpackConfig, env) {
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency',
            // favicon:'./src/assets/favicon.ico'
        })
    );
    for(var j=0; j<webpackConfig.module.loaders.length; j++){
        var loader = webpackConfig.module.loaders[j];
        if(loader.test && loader.test.toString() === '/\\.html$/'){
            loader.loader = 'html';
        }
        if(loader.test && loader.loader.toString() === '/\\.url/'){
            loader.query['options'] = { publicPath:'/'}
        }
    }
    //eslint
    webpackConfig.module['preLoaders'] = [{
      test: /\.(js|jsx)$/,
      loader: 'eslint',
      exclude: /node_modules/
    }]
    // 可重写覆盖roadhog的配置
    if (env === 'production') {
        var basePath = path.resolve(__dirname,'/static');
        webpackConfig.output.filename = '[name].[chunkhash].js';
        webpackConfig.output.publicPath='./';
        for(var i=0;i<webpackConfig.plugins.length;i++){
            var plugin = webpackConfig.plugins[i];
            if(plugin.filename && plugin.filename ==='[name].css'){
                plugin.filename = '[name].[contenthash].css'
            }
        }
    }
    return webpackConfig;
}