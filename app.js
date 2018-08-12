//Require packages
const Joi = require('joi');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Front end code
app.get('/', (request, response) => {
	response.render('index', {
    title: 'Project Management Tool',
    description: 'Welcome to the great project management tool. It\'s free and easy to use'
  });
});

app.get('/projects/', (request, response) => {
  Project.find({}, (error, projects) => {
    if (error) {
      console.log(error);
    }
    else {
      response.render('projects', {
        title: 'Projects',
        projects: projects
      });
    }
  })
});

app.get('/projects/project/:id', (request, response) => {
  const id = request.params.id;
  Project.findById(id, (error, project) => {
    if (error) {
      console.log(error);
    }
    else {
      response.render('project', {
        project: project
      });
    }
  })
});

app.get('/projects/add', (request, response) => {
	response.render('addProject', {
    title: 'Add project'
  });
});

app.post('/projects/add', (request, response) => {
  const body = request.body;
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
      response.redirect('/projects');
    }
  })
});

app.get('/projects/edit/:id', (request, response) => {
  const id = request.params.id;
  Project.findById(id, (error, project) => {
    if (error) {
      console.log(error);
    }
    else {
      response.render('editProject', {
        title: 'Edit project',
        project: project
      });
    }
  })
});

app.post('/projects/edit/:id', (request, response) => {
  const body = request.body;
	let project = {};
  project.name = body.name;
  project.type = body.type;
  project.owner = body.owner;
  project.startdate = body.startdate;
  project.enddate = body.enddate;
  project.status = body.status;
  project.phase = body.phase;
  project.modifieddate = new Date(Date.now()).toISOString();

  let query = {_id: request.params.id}

  Project.update(query, project, (error) => {
    if(error) {
      console.log(error);
      return;
    }
    else {
      response.redirect('/projects');
    }
  })
});

app.delete('/projects/delete/:id', (request, response) => {
  let query = {_id: request.params.id}
  Project.remove(query, (error) => {
    if(error){
      console.log(error);
    }
    response.send('Success');
  });
})

function validateProject(project) {
	const schema = {
		name: Joi.string().min(3).required()
	};
	return Joi.validate(project, schema);
}

//Start application
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
