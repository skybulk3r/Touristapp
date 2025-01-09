require('dotenv').config(); 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var sequelize = require('sequelize')
var cors = require('cors')
var bodyParser = require('body-parser')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
// const swaggerUi = require('swagger-ui-express')
// const swaggerFile = require('./swagger-output.json')
const usersRouter = require('./routes/users');
const carsRouter = require('./routes/cars');
const toursRouter = require('./routes/tours');
const rolesRouter = require('./routes/roles');
const bookingsRouter = require('./routes/bookings');
const apartmentsRouter = require('./routes/apartments');
const ordersRouter = require('./routes/orders');
const stripeWebhookRouter = require('./routes/stripeWebhook');
const authRouter = require('./routes/auth');

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

app.use('/users', usersRouter);
app.use('/apartments', apartmentsRouter);
app.use('/bookings', bookingsRouter);
app.use('/cars', carsRouter);
app.use('/orders', ordersRouter);
app.use('/roles', rolesRouter);
app.use('/tours', toursRouter);
app.use('/auth', authRouter);

// Add the Stripe webhook route
app.use('/api/stripe', stripeWebhookRouter);

app.use(bodyParser.json())
// app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
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