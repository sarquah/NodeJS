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

app.get('/projects/add', (request, response) => {
	response.render('add_project', {
    title: 'Add project'
  });
});

app.post('/projects/add', (request, response) => {
  const body = request.body;
	let project = new Project();
  project.name = body.name;
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

//API code
app.get('/api/projects', (request, response) => {
  Project.find({}, (error, projects) => {
    if (error) {
      console.log(error);
    }
    else {
      response.send(projects);
    }
  })
});

app.get('/api/projects/:id', (request, response) => {
	const id = request.params.id;
	const project = projects.find(p => p.id === parseInt(id));
	if (!project) return response.status(404).send('The project with the given ID was not found');
	response.send(project);
});

app.post('/api/projects', (request, response) => {
	const body = request.body;
	const { error } = validateProject(body);
	if (error) return response.status(400).send(error.details[0].message);
	const project = {
		id: projects.length +1,
		name: body.name
	};
	projects.push(project);
	response.send(project);
});

app.put('/api/projects/:id', (request, response) => {
	const id = request.params.id;
	const body = request.body;
	const project = projects.find(p => p.id === parseInt(id));
	if (!project) return response.status(404).send('The project with the given ID was not found');
	const { error } = validateProject(body);
	if (error) return response.status(400).send(error.details[0].message);
	project.name = body.name;
	response.send(project);
});

app.delete('/api/projects/:id', (request, response) => {
	const id = request.params.id;
	const project = projects.find(p => p.id === parseInt(id));
	if (!project) return response.status(404).send('The project with the given ID was not found');
	const index = projects.indexOf(project);
	projects.splice(index, 1);
	response.send(project);
});

function validateProject(project) {
	const schema = {
		name: Joi.string().min(3).required()
	};
	return Joi.validate(project, schema);
}

//Start application
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
