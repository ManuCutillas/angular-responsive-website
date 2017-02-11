const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const path = require('path')

const ActiveRoute = ['/','about','news']

router.use("*", ( req,res,next) =>
{
    res.header("Cache-Control","private,no-cache,no-store,must-revalidate");
    res.header("Expires","-1");
    res.header("Pragma","no-cache");
    next()
})

ActiveRoute.forEach( route => 
{
  router.get(`/${route}`,( req, res ) => 
  {
    res.sendFile(path.join(__dirname,'../../../../index.html'));
  })
  router.get(`/${route}/*`, ( req, res ) => 
  {
    res.sendFile(path.join(__dirname,'../../../../index.html'));
  })
})

//404 Handler
router.get('*', ( req, res )=> 
{
    const _404Response = JSON.stringify({ status: 404, message: 'No Content' }, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.status(404).send(_404Response)
})

module.exports = router;