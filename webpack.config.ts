import 'ts-helpers'
import { Helpers } from './helpers'
const { ContextReplacementPlugin, DefinePlugin, DllPlugin, DllReferencePlugin, ProgressPlugin, NoErrorsPlugin }=require( 'webpack' )
const CompressionPlugin=require('compression-webpack-plugin')
const CopyWebpackPlugin=require('copy-webpack-plugin');
const { ForkCheckerPlugin }=require('awesome-typescript-loader')
const HtmlWebpackPlugin=require('html-webpack-plugin')
const NamedModulesPlugin=require('webpack/lib/NamedModulesPlugin');
const UglifyJsPlugin=require('webpack/lib/optimize/UglifyJsPlugin')
const webpackMerge=require('webpack-merge')
const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path=require( 'path' )
const goenv=require( 'goenv' )

///HELPERS
var helpers = new Helpers()

//INIT ENV CONFIG
const goenvOptions={}
const ENV=goenv.init( goenvOptions )

//DEPLOYMENT CONFIGS
const EVENT=ENV.event
const SOURCE=ENV.source
const UNIVERSAL=ENV.universal
const PORT=ENV.server.port

const DLL_VENDORS = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/http',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/platform-server',
  '@angular/router',
  'rxjs',
  'ng2-responsive'
]

const POLYFILLS = [
  'sockjs-client',
  '@angularclass/hmr',
  'ts-helpers',
  'zone.js',
  'core-js/client/shim.js',
  'core-js/es6/reflect.js',
  'core-js/es7/reflect.js',
  'querystring-es3',
  'strip-ansi',
  'url',
  'punycode',
  'events',
  'webpack-dev-server/client/socket.js',
  'webpack/hot/emitter.js',
  'zone.js/dist/long-stack-trace-zone.js'
]

//SOURCE PATHS
const SRC_CLIENT_DIR = 'src/client'
const FILES_SRC = `${SRC_CLIENT_DIR}`
const SRC_SERVER_BIN = 'src/server/.bin'
const PROD_SERVER_BIN = 'prod/server/.bin'
const PROD_CLIENT_DIR = 'prod/client'

//FOLDERS AND FILES TO COPY
const COPY_FOLDERS = [
  { from: 'src/assets', to: 'assets' },
  { from: 'node_modules/hammerjs/hammer.min.js' },
  { from: 'node_modules/hammerjs/hammer.min.js.map' },
  { from: path.resolve(__dirname, `${FILES_SRC}/index.html`) },
  { from: path.resolve(__dirname, `${FILES_SRC}/styles`) },
  { from: path.resolve(__dirname, `${SRC_SERVER_BIN}`) }
]

export const CommonPlugins = [
  new CopyWebpackPlugin( [ ...COPY_FOLDERS ] ),
  new webpack.ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    root('./src'),
    {
      // your Angular Async Route paths relative to this root directory
    }
  ),
  // Loader options
  new webpack.LoaderOptionsPlugin({

  }),
  new ProgressPlugin(),
  new ForkCheckerPlugin(),
  new DefinePlugin( CONSTANTS ),
  new NamedModulesPlugin()
]

const defaultConfig = {
     resolve: {
        extensions: ['.ts', '.js', '.jpg', '.jpeg', '.gif', '.png', '.css', '.html']
    }
}

const commonConfig = function webpackConfig()
{
  let config= Object.assign({})
  
  config.module={
    rules:[
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
            helper.root('node_modules/@angular'),
            helper.root('node_modules/rxjs')
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          '@angularclass/hmr-loader',
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader?loader=system&genDir=src/compiled/src/app&aot=' + AOT
        ],
        exclude: [/\.(spec|e2e|d)\.ts$/]
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.html/, loader: 'raw-loader', exclude: [ helpers.root('src/index.html') ] },
      { test: /\.css$/, loader: 'raw-loader' }
    ]
  }

  config.node = {
    global: true,
    process: true,
    Buffer: false,
    crypto: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    clearTimeout: true,
    setTimeout: true
  }

  config.plugins=CommonPlugins

  if( EVENT === 'prod' )
  {
      config.plugins.push(
          new NoErrorsPlugin(),
          new UglifyJsPlugin({
            beautify: false,
            comments: false
          }),
          new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
          }),
          new BundleAnalyzerPlugin()
    )
  }
}

const clientConfig = function webpackConfig()
{
    let config = Object.assign({})

    if( SOURCE === 'dll' ) config= sourceDll()
    if( SOURCE === 'jit' && !UNIVERSAL ) config=sourceJit()
    if( SOURCE === 'aot' && !UNIVERSAL ) config=sourceAot()
    if( SOURCE === 'jit' && UNIVERSAL ) config=sourceJitUniversal()
    if( SOURCE === 'aot' && UNIVERSAL ) config=sourceAotUniversal()

    function sourceDll()
    {
        config.entry = {
           app_assets: [ './src/client/main' ],
           polyfill: [ ...POLYFILLS ],
           vendor: [ ...DLL_VENDORS ]
        }

        config.output = {
           path: helpers.root('dll'),
           filename: '[name].dll.js',
           library: '[name]'
        }

        config.devServer = {
            contentBase: './dll/client',
            port: 8080,
            historyApiFallback: {
              disableDotRule: true,
            },
            host: '0.0.0.0',
            watchOptions: {
                poll: undefined,
                aggregateTimeout: 300,
                ignored: /node_modules/
            }
        }
        
        let useProxy = false
        if (useProxy) 
        {
           Object.assign(config.devServer, {
              proxy: config: {
                  '**': 'http://localhost:3040'
              }
           })
        }
        return config
    }

    function sourceJit()
    {
        config.entry = {
           main: [ './src/client/main' ]
        }

        config.output = {
          path: helpers.root(`${EVENT}/client`),
          filename: 'index.bundle.js'
        }

        return config
    }

    function sourceAot()
    {
        config.entry = {
           main: [ './src/client/main.aot' ]
        }

        config.output = {
          path: helpers.root(`${EVENT}/client`),
          filename: 'index.bundle.js'
        }

        return config
    }

    function sourceJitUniversal()
    {
        config.entry = {
           main: [ './src/client/main.browser.universal' ]
        }

        config.output = {
          path: helpers.root(`${EVENT}/client`),
          filename: 'index.bundle.js'
        }

        return config
    }

    function sourceAotUniversal()
    {
        config.entry = {
           main: [ './src/client/main.browser.universal.aot' ]
        }

        config.output = {
          path: helpers.root(`${EVENT}/client`),
          filename: 'index.bundle.js'
        }

        return config
    }
    return config
}

const serverConfig = function webpackConfig()
{}

module.exports = webpackMerge({}, defaultConfig, commonConfig, clientConfig)
 