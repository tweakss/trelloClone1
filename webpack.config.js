module.exports = {
  entry: [
    './client/index.js'
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react'
          ]
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {

        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/inline'
        // type: 'asset/resource',
        // generator: {
        //   filename: 'public/assets/fonts/[name][ext]'
        // }

      },
      
    ]
  }
}
