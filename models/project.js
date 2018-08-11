const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Project = module.exports = mongoose.model('Project', projectSchema);
