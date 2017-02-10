const env = global.env;
module.exports = function () 
{
    const _jwtConfig = {
        token: env.server.auth.jwt.token || { secret: 'secret' },
        tokenExpiration: env.server.auth.jwt.tokenExpiration || 60,
        tokenExpirationSec: env.server.auth.jwt.tokenExpirationSec || 60 * 60
    };
    return _jwtConfig
}();