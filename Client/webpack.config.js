const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
var rra = require("recursive-readdir-async");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const rootPath = path.resolve(__dirname);
const paths = {
  ROOT_PATH: rootPath,
  SRC_PATH: path.resolve(rootPath, "src"),
  PUBLIC_DIR: path.resolve(rootPath, "public"),
  DIST_DIR: path.resolve(rootPath, "dist")
};






module.exports = async () => {

  // collect all .html pages
  const pages = await rra.list(paths.SRC_PATH, function (obj, index, total) {
    if(!obj.name.endsWith('.html')) {
        return true; // returns true to delete item
    }
  })

  pages.map(page => {
    console.log('CORRECT FORMAT: ' + path.resolve(paths.SRC_PATH))
    console.log(page.fullname); //path.resolve(paths.SRC_PATH, page),
    console.log(page.fullname.replace(paths.SRC_PATH.replace(/\\/g,'/'), '').slice(1))
  })

  // This is main configuration object.
  // Here you write different options and tell Webpack what to do
  return {

    // Path to your entry point. From this file Webpack will begin his work
    entry: ['./src/index.html'],

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".js"]
    },


    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader"
        },
        {
          test: /\.(html)$/,
          loader: "html-loader",
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false
          }
        },
        {
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
            {

              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        }
      ]
    },



    plugins: [
        // new HtmlWebpackPlugin({
        //   template: path.resolve(paths.SRC_PATH, 'index.html'),
        //   filename: 'index.html'
        // }),
        // new HtmlWebpackPlugin({
        //   template: path.resolve(paths.SRC_PATH, '/StaticPages/Announcements.html'),
        //   filename: 'StaticPages/Announcements.html'
        // }),

      ...pages.map(page => new HtmlWebpackPlugin({
        template: page.fullname.replace('/', '\\'),
        filename: page.fullname.replace(paths.SRC_PATH.replace(/\\/g,'/'), '').slice(1)// .slice(1)
      })),



        new webpack.HotModuleReplacementPlugin()
    ],




    devtool: 'source-map',

    devServer: {
      open: 'Chrome',
      // contentBase: 'src', // static files (images, etc),
      hot: true
      // publicPath: 'src'
    },

    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript
    // minifying and other thing so let's set mode to development
    mode: 'development'

  }
}
