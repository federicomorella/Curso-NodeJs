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
    },
    ()=>{
        err=new Error('Dish ' + req.params.dishID +  ' not found');
        console.log('Dish ' + req.params.dishID +  ' not found');
        err.status=404;
        return next(err);
    })
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


/**************operaciones sobre comentarios de un plato determinado***************/
dishRouter.route('/:dishID/comments')
.get((req,res,next)=>{
    //cliente pide todos los comentarios de un dish
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null){        
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments); 
        }
    },()=>{
        err=new Error('Dish ' + req.params.dishID +  ' not found');
        console.log('Dish ' + req.params.dishID +  ' not found');
        err.status=404;
        return next(err);
    })
    .catch((err)=>next(err));
    
})
.put((req,res,next)=>{
    res.statusCode=403;//forbiden
    res.end('PUT operation not supported on /dishes/'+req.params.dishID+'/comments');
})
.post((req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null){
            dish.comments.push(req.body); 
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish);
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
        else{//si no existe el plato
            err=new Error('Dish ' + req.params.dishID +  ' doesn\'t exist')
            err.status=404;
            return next(err);
        }

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{//borra todos los comentarios del plato seleccionado
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null){
            let i=dish.comments.length;
            for(;i>0;i--){
                dish.comments.pop();
            }
            dish.save()     
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish);
            },(err)=>next(err))
            .catch((err)=>next(err))          
            }

        else{//si no existe el plato
            err=new Error('Dish ' + req.params.dishID +  ' doesn\'t exist');
            err.status=404;
            return next(err);
        }

    },(err)=>next(err))
    .catch((err)=>next(err));
});


//operaciones sobre comentarios especificos
dishRouter.route('/:dishID/comments/:commentID')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishID)
    .then((dish)=>{
        if(dish!=null && dish.comments.id(req.params.commentID)!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments.id(req.params.commentID)); //

        }
        else{//
            err=new Error('Dish ' + req.params.dishID +  ' commentID ' + req.params.commentID + ' not found');
            err.status=404;
            return next(err);
        }


    },(err)=>next(err))
    .catch((err)=>next(err));

})
.put((req,res,next)=>{//update existing dish comment
    //busca dentro de comments un comment que tenga el _id buscado
    Dishes.findOne({_id:req.params.dishID ,  
        comments:{ $elemMatch:{_id: req.params.commentID}}})
    .then((dish)=>{
        if(dish!=null){ //si encontró el plato con ese comentario...
            console.log("Modificando comentario " + req.params.commentID + ":", dish.comments.id(req.params.commentID));
            let comment=dish.comments.id(req.params.commentID);
            Object.assign(comment,req.body);//actualiza velores de comment
            dish.save()//guarda en la base de datos
            .then(()=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err)=>next(err));

        }
        else{ //si no encontró plato con ese comentario...
            err=new Error('Dish ' + req.params.dishID + ' with comment ' + req.params.commentID +' not found');
            console.log('Dish ' + req.params.dishID + ' with comment ' + req.params.commentID +' not found');
            err.status=404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supportesd on /dishes/dishID/comments/commentID');
})
.delete((req,res,next)=>{
    Dishes.findOne({_id:req.params.dishID ,  
        comments:{ $elemMatch:{_id: req.params.commentID}}})
    .then((dish)=>{
        if(dish!=null){
            dish.comments.id(req.params.commentID).remove();
            dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish); //
            },
            (err)=>next(err)
            );


        }
        else{
            err=new Error('Dish ' + req.params.dishID +  ' commentID ' + req.params.commentID + ' not found');
            err.status=404;
            return next(err);
        }

        
    },(err)=>next(err))
    .catch((err)=>next(err));

});



module.exports =dishRouter;