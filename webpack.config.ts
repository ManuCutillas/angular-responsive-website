import 'ts-helpers'
const { ContextReplacementPlugin, DefinePlugin, DllPlugin, DllReferencePlugin, ProgressPlugin, NoErrorsPlugin }=require( 'webpack' )
const CompressionPlugin=require('compression-webpack-plugin')
const CopyWebpackPlugin=require('copy-webpack-plugin');
const { ForkCheckerPlugin }=require('awesome-typescript-loader')
const HtmlWebpackPlugin=require('html-webpack-plugin')
const NamedModulesPlugin=require('webpack/lib/NamedModulesPlugin');
const UglifyJsPlugin=require('webpack/lib/optimize/UglifyJsPlugin')
const webpackMerge=require('webpack-merge')
const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path=require('path')
const goenv=require('goenv')

///HELPERS
var helpers = new Helpers()

//INIT ENV CONFIG
const goenvOptions={}
const ENV=goenv.init( goenvOptions )

//EVENTS LIFECICLE
const EVENT=process.env.npm_lifecycle_event || ''
const AOT=EVENT.includes( 'aot' )
const DEV_SERVER=EVENT.includes( 'webdev' )
const DLL=EVENT.includes( 'dll' )
const HMR=helpers.hasProcessFlag('hot')
const PROD = EVENT.includes('prod')
const DEV = EVENT.includes('dev')
const UNIVERSAL = EVENT.includes('universal')
const PORT=ENV.server.port

const CONSTANTS = {
  AOT: AOT,
  ENV: PROD ? JSON.stringify(PROD) : JSON.stringify(DEV),
  HMR: HMR,
  HOST: JSON.stringify(CONFIG.HOST),
  PORT: PORT,
  STORE_TOOL: JSON.stringify(CONFIG.STORE_TOOL),
  UNIVERSAL: UNIVERSAL
}

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
  '@ngrx/core',
  '@ngrx/core/add/operator/select.js',
  '@ngrx/effects',
  '@ngrx/router-store',
  '@ngrx/store',
  '@ngrx/store-devtools',
  '@ngrx/store-log-monitor',
  'ngrx-store-freeze',
  'ngrx-store-logger',
  'rxjs',
  'ng2-responsive'
];

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

export const commonPlugins = [
  new CopyWebpackPlugin( COPY_FOLDERS ),
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

 