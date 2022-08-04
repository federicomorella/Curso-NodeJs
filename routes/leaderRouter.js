const express=require('express');
const bodyParser=require('body-parser');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
const Leaders=require('../models/leaders');
//const mongoose=require('mongoose');



//operaciones sobre todos los leaders
leaderRouter.route('/')
.get(async (req,res,next)=>{
    try{
        const leaders=await Leaders.find({});
        res.setHeader('Content-Type','Application/json');
        res.statusCode=200;
        res.json(leaders); 
    }
    catch(err){
        return next(err);
    }
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on Leaders');
})
.post(async (req,res,next)=>{
    try{
        const leader=await Leaders.create(req.body);
        res.statusCode=200;
        res.setHeader('Content-Type','Application/json');
        res.json(leader);
    }
    catch(err){
        return next(err);
    }
})
.delete(async (req,res,next)=>{
    try{
        const resp=await Leaders.deleteMany({});
        res.statusCode=200;
        res.setHeader('Content-Type','Application/json');
        res.json(resp);
    }
    catch(err){
        return next(err);
    }
})

leaderRouter.route('/:leaderID')
.get(async (req,res,next)=>{
    try{
        const leader=await Leaders.findById(req.params.leaderID);
        if(leader!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','Application/json');
            res.json(leader);
        }
        else{
            err=new Error('Promotion ' + req.params.leaderID +' not found');
            err.status=404;
            return next(err);
        }
    }
    catch(err){
        return next(err);
    }
})
.put(async (req,res,next)=>{
    try{
        const leader= await Leaders.findByIdAndUpdate(req.params.leaderID,req.body,{new:true});
        if(leader!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','Application/json');
            res.json(leader);
        }
        else{
            err=new Error('Promotion ' + req.params.leaderID +' not found or couldn\'t be updated');
            err.status=404;
            return next(err);
        }
    }
    catch(err){
        return next(err);
    }
    
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported');
})
.delete(async (req,res,next)=>{
    try{
        const resp=await Leaders.findByIdAndRemove(req.params.leaderID);
        res.statusCode=200;
        res.setHeader('Content-Type','Application/json');
        res.json(resp);
    }
    catch(err){
        return next(err);
    }    
});

module.exports=leaderRouter;