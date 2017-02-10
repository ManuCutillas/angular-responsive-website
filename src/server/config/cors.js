const cors = require('cors');
const env = global.env;
module.exports = function () 
{
    const _whitelist = env.server.cors.whitelist || [`http://${env.address}`];
    const _allowedMethods = env.server.cors.allowedMethods || ['*'];
    const _allowedHeaders = env.server.cors.allowedHeaders || ['*'];
    const _exposedHeaders = env.server.cors.exposedHeaders || ['*'];
    const _credentials = env.server.cors.credentials || false;
    const _maxAge = env.server.cors.maxAge || 3600;

    const corsOptionsAllow = 
    { 
        origin: env.server.cors.options.corsOptionsAllow || true,
        methods: _allowAllMethods,
        allowedHeaders: _allowedHeaders,
        exposedHeaders: _exposedHeaders,
        credentials: _credentials,
        maxAge: _maxAge
    };

    const corsOptionsDisabled = 
    {
        origin: env.server.cors.options.corsOptionsDisabled || false
    };

    function _corsMiddleware ( req, done )
    {
        cors(( req, done ) => 
        {
            let corsOptions;
            if( _whitelist.indexOf(req.header('Origin')) !== -1 )
            {
                corsOptions = corsOptionsAllow
            }
            else
            {
                // disable CORS for this request 
                corsOptions = corsOptionsDisabled;
            };
            done(null, corsOptions);
        });
    };
    return _corsMiddleware;
}();