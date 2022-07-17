const express=require('express');
const bodyParser=require('body-parser');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());


//operaciones sobre todos los leaders
leaderRouter.route('/')
.all((req,res,next)=>{
    res.status=200;//OK
    res.setHeader('Content-Type','text/plain')
    next();
})
.get((req,res,next)=>{
    res.end('will send leaders');
})
.put((req,res,next)=>{
    res.statusCode=403;//forbiden
    res.end('PUT operation not supported');
})
.post((req,res,next)=>{
    res.end('will add leader: '+ JSON.stringify( req.body));
})
.delete((req,res,next)=>{
    res.end('will delete all leaders');
})

//agrega operaciones sobre cada leader
leaderRouter.route('/:leaderID')
.all((req,res,next)=>{
    res.status=200;
    res.setHeader('Content-Type','text/plain')
    next();
})
.get((req,res,next)=>{
    res.end('will send details of leader'+ req.params.leaderID);
})
.put((req,res,next)=>{
    res.end('Will update leader'+ req.params.leaderID + '\n' + JSON.stringify(req.body));
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on leader' + req.params.leaderID);
})
.delete((req,res,next)=>{
    res.end('will delete leader ' + req.params.leaderID) ;
});

module.exports=leaderRouter;