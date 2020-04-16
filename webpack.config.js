
const path = require('path')
const getIP = require('./get-ip')

const { HOST, PORT } = getIP()

module.exports = {
  entry: {
    start: path.join(__dirname, 'src', 'start.js'),
    room: path.join(__dirname, 'src', 'room.js')  
  },

  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    proxy: {
      '/api': `http://${HOST}:${PORT}`
    }
  }
}