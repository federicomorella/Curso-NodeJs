const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
const mongoose=require('mongoose');
const Dishes=require('../models/dishes');

//operaciones sobre todos los dishes
dishRouter.route('/')
.get((req,res,next)=>{
    //cliente pide todos los dishes => find()
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dishes); //
    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.put((req,res,next)=>{
    res.statusCode=403;//forbiden
    res.end('PUT operation not supported on /dishes');
})
.post((req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish creater: ',dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{//delete all the dishes
    res.end('Deleting all dishes');
    Dishes.remove({})
    .then((resp)=>{
        console.log('Dish removed: ',resp);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


//operaciones sobre platos especificos
dishRouter.route('/:dishID')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish); //
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.put((req,res,next)=>{//update existing dish
    Dishes.findByIdAndUpdate(req.params.dishID,
        {$set:req.body},
        {new:true})//si es satisfactorio devuelve el nuevo objeto
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish); //
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supportesd on /dishes/');
})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishID)//si es satisfactorio devuelve el nuevo objeto
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp); //
    },(err)=>next(err))
    .catch((err)=>next(err));

});



module.exports =dishRouter;