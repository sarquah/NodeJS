const express = require('express');
const router = express.Router();

//Load Project model
let Project = require('../models/project');
//Load User model
let User = require('../models/user');

//Express validator Middleware
const { check, validationResult } = require('express-validator/check');

router.get('/project/:id', (req, res) => {
  const id = req.params.id;
  Project.findById(id, (error, project) => {
    if (error) {
      console.log(error);
    }
    else {
      User.findById(project.owner, (err, user) => {
        res.render('project', {
          project: project,
          owner: user.name
        });
      });
    }
  })
});

router.get('/add', (req, res) => {
	res.render('addProject', {
    title: 'Add project'
  });
});

router.post('/add', [
    check('name').not().isEmpty().withMessage('Project must have a name')
  ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      // return res.status(422).json({ errors: errors.array() });
      res.render('addProject', {
        title: 'Add project',
        errors: errors.array()
      });
    }
    const body = req.body;
  	let project = new Project();
    project.name = body.name;
    project.type = body.type;
    project.owner = req.user._id;
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
});

router.get('/edit/:id', (req, res) => {
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

router.post('/edit/:id', (req, res) => {
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

router.delete('/delete/:id', (req, res) => {
  let query = {_id: req.params.id}
  Project.remove(query, (error) => {
    if(error){
      console.log(error);
    }
    res.send('Success');
  });
})

router.get('/', (req, res) => {
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

module.exports = router;
