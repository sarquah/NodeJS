const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startdate: {
    type: Date,
    required: false
  },
  enddate: {
    type: Date,
    required: false
  },
  owner: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  phase: {
    type: String,
    required: false
  },
  createddate: {
    type: Date,
    required: false
  },
  modifieddate: {
    type: Date,
    required: false
  },
  createdby: {
    type: String,
    required: false
  }
});

const Project = module.exports = mongoose.model('Project', projectSchema);
