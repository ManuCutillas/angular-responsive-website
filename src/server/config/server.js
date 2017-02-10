const ip=require('ip');
const path=require('path');
const env=global.env;
const address = ip.address();
const envDistRoot=env.root;
module.exports = function () 
{
    const srcPath=`${envDistRoot}/client/src`;
    const publicPath=`${envDistRoot}/client`;
    const assetsPath=`${envDistRoot}/client/assets`;
    return {
        srcPath: _srcPath,
        publicPath: _publicPath,
        assetsPath: _assetsPath
    };
}();