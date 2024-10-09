var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movementsRouter = require ('./routes/movements');
var categoriesRouter = require ('./routes/categories');
var vendorsRouter = require ('./routes/vendors');
var walletsRouter = require ('./routes/wallets');
var pocketsRouter = require ('./routes/pockets');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('secretKey', '3513551863');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Habilitar CORS para todas las rutas
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'], // Permitir el origen de tu frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],  // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],   // Encabezados permitidos
  exposedHeaders: ['Content-Disposition'],  // Exponer 'Content-Disposition' para que el navegador pueda manejar la descarga
}));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movements', movementsRouter);
app.use('/categories', categoriesRouter);
app.use('/vendors', vendorsRouter);
app.use('/wallets', walletsRouter);
app.use('/pockets', pocketsRouter);

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
  res.json ({ "error" : true, "message" : err.message})
  // res.render('error');
  });

  function validateUser ( req, res, next ) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
      if(err){
        res.json( {message: err.message})
      }else{
        console.log("decoded: ", decoded)
        next()
      }
  
    })
  }
module.exports = app;