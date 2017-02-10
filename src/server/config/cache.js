const env = global.env;
module.exports = function () 
{
    const _rdisOptions = 
    {
        host: env.cache.redis.ide.host || '127.0.0.1',
        port: env.cache.redis.ide.port || 3006
    };

    const _rdisDB = 
    {
        renders: env.cache.redis.db.renders || 0,
        routes: env.cache.redis.db.routes || 1,
        metadata: env.cache.redis.db.metadata || 2
    };

    const _routingHashAccess = 
    {
        public: env.cache.redis.routing.hash.public || 'PUBLIC',
        api: env.cache.redis.routing.hash.api || 'API',
        private: env.cache.redis.routing.hash.protected || 'PROTECTED',
        admin: env.cache.redis.routing.hash.admin || 'ADMIN'
    };

    const _cacheHeaders = (req, res, next)=>
    {
        res.header('Cache-Control', 'max-age=60');
        res.header('Accept-Encoding','gzip');
        next();
    };

    return {
        cacheHeaders: _cacheHeaders,
        rdisOptions : _rdisOptions,
        rdisDB: _rdisDB,
        routingHashAccess: _routingHashAccess
    };
    
}();