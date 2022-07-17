const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


//operaciones sobre todos los dishes
dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;//ok
    res.setHeader('Content-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('will send all the dishes to you!');
})
.put((req,res,next)=>{
    res.statusCode=403;//forbiden
    res.end('PUT operation not supported on /dishes');
})
.post((req,res,next)=>{
    res.end('will add dish ' + req.body.name + ' with details ' + req.body.description);
    console.log(req.body);
})
.delete((req,res,next)=>{
    res.end('Deleting all dishes');
});


//operaciones sobre platos especificos
dishRouter.route('/:dishID')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('will send you details of dish ' + req.params.dishID + ' to you');
})
.put((req,res,next)=>{
    res.end('will update dish ' + req.params.dishID + ' with name '+ req.body.name + ' and details ' + req.body.description );
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supportesd on /dishes/');
})
.delete((req,res,next)=>{
    res.end('will delete dish ' + req.params.dishID );
});



module.exports =dishRouter;