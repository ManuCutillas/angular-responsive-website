const env = global.env;
module.exports = function () 
{
    const _mongodb = env.db.mongodb.path || 'mongodb://localhost/db-responsive';
    return _mongodb;
}();