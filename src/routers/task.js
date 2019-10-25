const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require("../middlewares/authMiddlewares");

router.post("/", auth, async (req, res) => {
  const task = new Task({ 
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e.toString());
  }
  // task.save().then(() => {
  //   res.status(201).send(task);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // })
})

router.get("/", auth, async (req, res) => {
  try {
    // const ele = await Task.find({owner: req.user._id});
    const match = {}
    const options = {}
    const sort = {}

    //Matching
    if (req.query.completed) match.completed = req.query.completed === "true"
    
    //Options
    if (req.query.limit) options.limit = parseInt(req.query.limit)
    if (req.query.skip) options.skip = parseInt(req.query.skip)
    
    //Sort
    if (req.query.sortBy) {
      const sort_params = req.query.sortBy.split(":");
      sort[sort_params[0]] = sort_params[1] === "desc"? -1: 1;
    }


    await req.user.populate({ 
      path:'tasks',
      match,
      options: {...options, sort},
  }).execPopulate()
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
  // Task.find({})
  //   .then((ele) => {
  //     res.status(200).send(ele);
  //   }).catch((e) => {
  //     res.status(500).send(e);
  //   })
})

router.get("/:id", auth, async (req, res) => {
  try {
    // const ele = await Task.findById(req.params.id);
    const ele = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    console.log(ele, req.user._id);
    if (!ele) res.status(204).send('Nothing Found')
    else res.status(200).send(ele);
  } catch (e) {
    res.status(500).send(e.toString());
  }
  // Task.findById(req.params.id)
  //   .then((ele) => {
  //     if (!ele) res.status(204).send({})
  //     else res.status(200).send(ele);
  //   }).catch((e) => {
  //     res.status(500).send(e);
  //   })
})

router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["completed", "description"];
  const isValidOperation = updates.every((ele) => allowedUpdate.includes(ele));
  
  if (! isValidOperation) res.status(400).send({error: "Field not found"});    
  
  try {
    const task = await Task.findByOne({_id: req.params.id, owner: req.user._id});
    updates.forEach((ele) => task[ele] = req.body[ele]);
    await task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, 
    //   {new: true, runValidators: true});
      if (!task) res.status(204).send()  
      res.send(task);
    } catch (e) {
      res.status(400).send();    
  }
})


router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id});

    if (!task) res.status(204).send();  
    res.send(task);
  } catch (e) {
    res.status(400).send(e);    
  }
})


module.exports = router;