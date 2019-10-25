const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./Task");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:  true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(pas){
      const reg = new RegExp("password");
      if (pas.match(reg) !== null) throw new Error("Including 'password' is not safe")
    }
  },
  mail: {
    type: String,
    required: true,
    validate(v){
      if (!validator.isEmail(v)) throw new Error("Email is invalid")
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value){
      if (value<0){
        throw new Error("Age must be a positive number");
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps:  true,
  versionKey: false // You should be aware of the outcome after set to false
})

UserSchema.virtual("tasks", {
  localField: '_id',
  ref: "Task",
  foreignField: "owner",
})

UserSchema.statics.findByCredentials = async (mail, password)=>{
  const user = await User.findOne({mail});
  console.log(user, mail);
  if (!user) throw new Error("User with that mail not found")

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Wrong password")

  return user;
}

UserSchema.methods.toJSON = function(){ //Overwrites methos used for express
  const user = this
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  
  return userObject;
}

UserSchema.methods.generateAuthToken = async function(){
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "SomeSecretValue");
  
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

UserSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next();
})

UserSchema.pre("remove", async function(next){
  const user =  this;

  await Task.deleteMany({owner: user._id});

  next()
})
const User = mongoose.model("User", UserSchema);

module.exports = User;
