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

app.get('/projects/', (req, res) => {
  Project.find({}, (error, projects) => {
    if (error) {
      console.log(error);
    }
    else {
      res.render('projects', {
        title: 'Projects',
        projects: projects
      });
    }
  })
});

app.get('/projects/project/:id', (req, res) => {
  const id = req.params.id;
  Project.findById(id, (error, project) => {
    if (error) {
      console.log(error);
    }
    else {
      res.render('project', {
        project: project
      });
    }
  })
});

app.get('/projects/add', (req, res) => {
	res.render('addProject', {
    title: 'Add project'
  });
});

app.post('/projects/add', (req, res) => {
  req.checkBody('name', 'Project name is required').notEmpty();
  let errors = req.validationErrors();
  if(errors){
    res.render('addProject', {
      title: 'Add project',
      errors: errors
    });
  }
  else {
    const body = req.body;
  	let project = new Project();
    project.name = body.name;
    project.type = body.type;
    project.owner = body.owner;
    project.startdate = body.startdate;
    project.enddate = body.enddate;
    project.status = body.status;
    project.phase = body.phase;
    project.createddate = new Date(Date.now()).toISOString();
    project.modifieddate = new Date(Date.now()).toISOString();
    project.save((error) => {
      if(error) {
        console.log(error);
        return;
      }
      else {
        req.flash('success', 'Project added!');
        res.redirect('/projects');
      }
    });
  }
});

app.get('/projects/edit/:id', (req, res) => {
  const id = req.params.id;
  Project.findById(id, (error, project) => {
    if (error) {
      console.log(error);
    }
    else {
      res.render('editProject', {
        title: 'Edit project',
        project: project
      });
    }
  })
});

app.post('/projects/edit/:id', (req, res) => {
  const body = req.body;
	let project = {};
  project.name = body.name;
  project.type = body.type;
  project.owner = body.owner;
  project.startdate = body.startdate;
  project.enddate = body.enddate;
  project.status = body.status;
  project.phase = body.phase;
  project.modifieddate = new Date(Date.now()).toISOString();

  let query = {_id: req.params.id}

  Project.update(query, project, (error) => {
    if(error) {
      console.log(error);
      return;
    }
    else {
      req.flash('success','Project updated!');
      res.redirect('/projects');
    }
  })
});

app.delete('/projects/delete/:id', (req, res) => {
  let query = {_id: req.params.id}
  Project.remove(query, (error) => {
    if(error){
      console.log(error);
    }
    res.send('Success');
  });
})

//Start application
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
