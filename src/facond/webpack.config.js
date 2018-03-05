var path = require('path')

/* eslint-disable */
module.exports = {
/* eslint-enable */
  entry: {
    main: ['babel-polyfill', './index.js'],
  },
  output: {
    path: path.resolve('../facond/static/'),
    filename: 'facond.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        //exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['stage-2', 'babel-preset-env']
          }
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'url-loader?limit=10000&mimetype=application/font-woff'
        }
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: 'file-loader' },
          {
            loader: 'css-loader', options: {
              sourceMap: true
            }
          },
          { loader: 'extract-text' },
          {
            loader: 'sass-loader', options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}
