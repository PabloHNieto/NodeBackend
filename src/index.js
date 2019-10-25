const express = require('express');
require("./db/mongoose"); //Runs the file
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routers
app.use("/tasks", taskRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// const bcrypt = require('bcryptjs');
// const myFunction = async () => {
//   const password = "Red123";
//   const hashPassword  = await bcrypt.hash(password, 8);
//   const isMatch = await bcrypt.compare("Red123", hashPassword);
//   console.log(password, hashPassword, isMatch);
// }

// myFunction();