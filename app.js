var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var FileStore=require('session-file-store')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var leaderRouter=require('./routes/leaderRouter');
var promoRouter=require('./routes/promoRouter');

const mongoose=require('mongoose');
//const Dishes =require('./models/dishes');//esto está requerido en el router. No hace falta tenerlo acá
const url='mongodb://localhost:27017/conFusion';
const connect=mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected correctly to server')
},(err)=>{console.log(err);});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookieParser agrega signedCookies a req
//app.use(cookieParser('123-456-789-0987')); //define la clave secreta para firmar las cookies. Puede ser cualquier string

//session envía una cookie con el nombre definido en name firmada con secret
app.use(session({ //configura session. 
  name:'session-id',
  secret:'123-456-7890',
  saveUninitialized:false,
  resave:false,
  store:new FileStore()
}));

//cada .use recive los parametros req,res y next y los va pasando en orden de aparición al próximo .use
//en este punto intercalo el middleware de autenticación de usuario
function auth(req,res,next){
  if(!req.session.user){//verifica si existe session
    var authHeader=req.headers.authorization;
    if(!authHeader){
      var err=new Error('You are not authenticated!')
      res.setHeader('WWW-Authenticate','Basic') //contesta exigiendo que se autorice
      err.status=401; //unauthorized
      return next(err);
    }
  
    var auth= new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':'); //en el header aparece "username:password" codificado en base64
    var username=auth[0];
    var password=auth[1];
    if(username==='admin' && password==='password'){   
      req.session.user='admin';
      console.log('sending session');
      return next();
    }
    else{
      var err=new Error('Wrong username or password')
      res.setHeader('WWW-Authenticate','Basic') //contesta exigiendo que se autorice
      err.status=401; //unauthorized
      return next(err);
    }
  }
  else{//si req incluye la cookie user
    if(req.session.user==='admin'){
      return next()
    }
    else{
      var err=new Error('Wrong authentication')
      err.status=401; //unauthorized
      return next(err);
    }
  }
 
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));//servidor estático
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
