const _server=require('./server');
const _cache=require('./cache');
const _db=require('./db');
const _auth=require('./auth');
const _cors=require('./cors');
module.exports = 
{
  server:_server,
  cache:_cache,
  db:_db,
  auth:_auth,
  cors:_cors
};