const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//Load User model
let User = require('../models/user');

//Express validator Middleware
const { check, validationResult } = require('express-validator/check');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', [
    check('name').not().isEmpty().withMessage('Name cannot be empty'),
    check('email').not().isEmpty().withMessage('E-mail cannot be empty'),
    check('email').isEmail().withMessage('You must type a valid e-mail'),
    check('username').not().isEmpty().withMessage('Username cannot be empty'),
    check('password').not().isEmpty().withMessage('Password cannot be empty'),
    check('password').isLength({ min: 7 }).withMessage('Password must have a minimum length of 7'),
    // check('password2').equals(req.body.password).withMessage('Passwords do not match')
  ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      // return res.status(422).json({ errors: errors.array() });
      res.render('register', {
        errors: errors.array()
      });
    }
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save((err) => {
          if(err){
            console.log(err)
            return;
          } else {
            req.flash('success', 'You are now registered');
            res.redirect('/users/login');
          }
        });
      });
    });
});

router.get('/login', (req,res)=>{
  res.render('login');
});

router.post('/login', [
  check('username').not().isEmpty().withMessage('Username cannot be empty'),
  check('password').not().isEmpty().withMessage('Password cannot be empty'),
], (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('login', {
      errors: errors.array()
    });
  }
  res.redirect('/projects');
});

module.exports = router;
