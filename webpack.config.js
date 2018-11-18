const path = require('path');
const assembleWebpack = require('assemble-webpack');

module.exports = {
  mode: 'development',
  entry: './src/js/app.js',
  output: {
    filename: 'js/bundle.js',
    path: path.join(__dirname, 'public')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 9000,
    open: true,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.(hbs)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'assemble-webpack',
            options: {
              layouts: path.resolve('./src/html/layouts/**/*.hbs'),
              partials: path.resolve('./src/html/partials/**/*.hbs')
            }
          }
        ]
      },
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new assembleWebpack.AttachedPlugin({
      baseLayout: ['./src/html/layouts/**/*.hbs'],
      basePages: ['./src/html/pages/**/*.hbs'],
      partialsLayout: ['./src/html/partials/**/*.hbs']
    })
  ]
};
