const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/authMiddlewares');

router.post("/", async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (e) {
    console.log(e)
    res.status(400).send(e.toString());
  }

})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.mail, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token});
  } catch (e) {
    res.status(400).send(e.toString());
  }
})

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tok) => {
      return tok.token !== req.token;
    })
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e.toString())
  }
})

router.post("/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e.toString())
  }
})

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
})


router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "mail", "password", "age"];
  const isValidOperation = updates.every((ele) => allowedUpdate.includes(ele));
  
  if (! isValidOperation) res.status(400).send({error: "Field not found"});    
  
  try {
    const user = req.user;
    updates.forEach((ele) => user[ele] = req.body[ele]);
    await user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, 
    //  {new: true, runValidators: true}); Bypasses Mongoose
    // if (!user) res.status(204).send();  
    res.send(user);
  } catch (e) {
    res.status(400).send(e.toString());    
  }
})

router.delete("/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndRemove(req.user._id);

    // if (!user) res.status(204).send();  
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.toString());    
  }
})

module.exports = router;
