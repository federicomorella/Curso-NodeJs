const express=require('express');
const bodyParser=require('body-parser');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
//const mongoose=require('mongoose');
const Promotions=require('../models/promotions');


promoRouter.route('/')
.get(async (req,res,next)=>{
    try{
        const promos=await Promotions.find({});
        res.setHeader('Content-Type','Application/json');
        res.statusCode=200;
        res.json(promos); 
    }
    catch(err){
        return next(err);
    }
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on Promotions');
})
.post(async (req,res,next)=>{
    try{
        const promo=await Promotions.create(req.body);
        res.statusCode=200;
        res.setHeader('Content-Type','Application/json');
        res.json(promo);
    }
    catch(err){
        return next(err);
    }
})
.delete(async (req,res,next)=>{
    try{
        const resp=await Promotions.deleteMany({});
        res.statusCode=200;
        res.setHeader('Content-Type','Application/json');
        res.json(resp);
    }
    catch(err){
        return next(err);
    }
})

promoRouter.route('/:promoID')
.get(async (req,res,next)=>{
    try{
        const promo=await Promotions.findById(req.params.promoID);
        if(promo!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','Application/json');
            res.json(promo);
        }
        else{
            err=new Error('Promotion ' + req.params.promoID +' not found');
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
        const promo= await Promotions.findByIdAndUpdate(req.params.promoID,req.body,{new:true});
        if(promo!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','Application/json');
            res.json(promo);
        }
        else{
            err=new Error('Promotion ' + req.params.promoID +' not found or couldn\'t be updated');
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
        const resp=await Promotions.findByIdAndRemove(req.params.promoID);
        res.statusCode=200;
        res.setHeader('Content-Type','Application/json');
        res.json(resp);
    }
    catch(err){
        return next(err);
    }    
});

module.exports=promoRouter;