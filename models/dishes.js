const mongoose=require('mongoose');
require('mongoose-currency').loadType(mongoose); //agrega el tipo currency a mongoose
const Currency=mongoose.Types.Currency;

const Schema=mongoose.Schema;

const commentSchema= new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true,
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
},
{
    timestamp:true   
});

const dishSchema=new Schema({
    name:{
        type:String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required: true,
        unique: true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
    featured:{
        type:Boolean,
        default:false

    },
    comments:[commentSchema]//agrega un subdocumento en dishes con el esquema comments
},{
    timestamps:true
});

var Dishes=mongoose.model('Dish',dishSchema);

module.exports=Dishes;
