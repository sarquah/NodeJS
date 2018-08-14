const express = require('express');
const router = express.Router();

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
      return res.status(422).json({ errors: errors.array() });
      // res.render('addProject', {
      //   title: 'Add project',
      //   errors: errors.array()
      // });
    }
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
})

module.exports = router;
