var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var sequelize = require('sequelize')
var cors = require('cors')

// const swaggerUi = require('swagger-ui-express')
// const swaggerFile = require('./swagger-output.json')
const userRouter = require('./routes/user');
const bodyParser = require('body-parser')


require('dotenv').config();
var db = require('./models'); 

var app = express();

db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch(err => {
    console.error("Error synchronizing the database:", err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
}));

app.options('*', cors());

app.use('/user', userRouter);

app.use(bodyParser.json())
// app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

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