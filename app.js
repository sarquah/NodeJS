//Require packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

//Database
mongoose.connect('mongodb://localhost:27017/projectmanagement', {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});
db.on('error', (error) => {
  console.log(error);
});

//Init app
const app = express();

//Load models
let Project = require('./models/project');

//Set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());

//Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator Middleware
const { check, validationResult } = require('express-validator/check');

//Front end code
app.get('/', (req, res) => {
	res.render('index', {
    title: 'Project Management Tool',
    description: 'Welcome to the great project management tool. It\'s free and easy to use'
  });
});

//Route files
let projects = require('./routes/projects');
let users = require('./routes/users');
app.use('/projects', projects);
app.use('/users', users);

//Start application
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
