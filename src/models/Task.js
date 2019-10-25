const mongoose = require('mongoose');
const User = require("./User");

const TaskSchema = mongoose.Schema({
  description: {
    type: String,
    trim:  true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false // You should be aware of the outcome after set to false
});

const Task = mongoose.model("Task", TaskSchema);


module.exports = Task;
