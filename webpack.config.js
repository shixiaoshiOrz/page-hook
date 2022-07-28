const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  // mode: 'development',
  output: {
   publicPath: './',  // 具体相对路径还需要根据实际情况判断，比如也可能是 ../
   filename: 'tool.js'
  },
  module: {
    rules: [
      
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.less$/i,
        use: [
          // 将less转换为css
          'vue-style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ]
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    new UglifyJsPlugin()
  ],
  

}