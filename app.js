
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var jwt = require('jsonwebtoken'); // Asegúrate de que JWT esté importado


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movementsRouter = require ('./routes/movements');
var categoriesRouter = require ('./routes/categories');
var vendorsRouter = require ('./routes/vendors');
var walletsRouter = require ('./routes/wallets');
var pocketsRouter = require ('./routes/pockets');
var notificationsRouter = require ('./routes/notifications');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('secretKey', process.env.SECRET_KEY);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Habilitar CORS para todas las rutas
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:41489', 'https://lo-sportafoglio-front-git-develop-celes-projects-b4460b91.vercel.app', 'https://lo-sportafoglio-front.vercel.app/'], // Permitir el origen de tu frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'HEAD'],  // Métodos HTTP permitidos
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
app.use('/notifications', notificationsRouter);


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

  function validateUser(req, res, next) {
    // Obtener el token desde los headers y quitar el prefijo 'Bearer ' si existe
    const token = req.headers['authorization']?.split(' ')[1];

    // Verificar que el token existe
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Verificar el token usando jwt.verify
    jwt.verify(token, req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            return res.status(401).json({ message: err.message });
        } else {
            console.log("decoded: ", decoded);
            next(); // Si todo está bien, llama a next()
        }
    });
}
app.validateUser = validateUser; 
module.exports = app;