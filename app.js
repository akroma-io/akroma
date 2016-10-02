const pkg = require('./package.json');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const sass = require('node-sass-middleware');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cookieParser());
app.use(sass({
   src: path.join(__dirname, 'modules'),
   dest: path.join(__dirname, `public/${pkg.name}`),
   outputStyle: 'compressed',
   prefix: `/${pkg.name}`
}));
app.use(express.static(path.join(__dirname, 'public')));

// Configure routing
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
   const err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// Handles all errors that slip through
app.use((err, req, res, next) => {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
   });
});

app.locals = {
   app: {
      name: pkg.name,
      version: pkg.version
   }
};

module.exports = app;
