/**
 * ANGULAR-RESPONSIVE-WEBSITE SERVER
 *
 * @Created_by Manu Cutillas
 * @Contributors 
 * @created_at Febr 10, 2017
 * @updated_at Febr 10, 2017 - by ManuCutillas
 * @version_0.1.0
 *
 * Dependencies:
 *
 * @more_info https://github.com/ManuCutillas
 *            https://www.npmjs.com/~manucutillas
 *
 * @description : ANGULAR-RESPONSIVE-WEBSITE
 *
 */
import  *  as  path           from 'path';
import  *  as  favicon        from 'serve-favicon';
import  *  as  express        from 'express';
import  *  as  bodyParser     from 'body-parser';
import  *  as  cookieParser   from 'cookie-parser';
import  *  as  compression    from 'compression';

const env=require( '../env' );

const app=express();
app.disable( 'x-powered-by' );
app.set( 'json spaces', 2 );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( cookieParser() );
app.use( compression() );
app.set('port', process.env.PORT || env.server.port);

const clientRouting=require('./routes/client');
app.use(clientRouting);

module.exports = app;



