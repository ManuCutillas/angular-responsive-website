const goenv = require('goenv');
const options = 
{
        dirname: __dirname,
        types:['json','js'],
        excludeFiles:['index.js']
};
const env = goenv.init(options);
module.exports = env;