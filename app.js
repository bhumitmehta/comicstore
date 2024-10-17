const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const listingRouter = require('./routes/listing')
const managementRouter =require('./routes/management')
const detailsRouter = require('./routes/details')
const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/',indexRouter)
app.use('/users',usersRouter)
app.use('/api/v1/management', managementRouter);
app.use('/api/v1/list', listingRouter);
app.use('/api/v1/comics/details',detailsRouter);

module.exports = app;

