const express=require('express');
const bodyParser=require('body-parser');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next)=>{
    res.status=200;
    res.setHeader('Content-Type','text/plain')
    next();
})
.get((req,res,next)=>{
    res.end('will send promos');
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})
.post((req,res,next)=>{
    res.end('will add promo: '+ JSON.stringify( req.body));
})
.delete((req,res,next)=>{
    res.end('will delete all promos');
})

promoRouter.route('/:promoID')
.all((req,res,next)=>{
    res.status=200;
    res.setHeader('Content-Type','text/plain')
    next();
})
.get((req,res,next)=>{
    res.end('will send details of promo '+ req.params.promoID);
})
.put((req,res,next)=>{
    res.end('Will update promo '+ req.params.promoID + '\n' + JSON.stringify(req.body));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported');
})
.delete((req,res,next)=>{
    res.end('will delete promo ' + req.params.promoID) ;
});

module.exports=promoRouter;