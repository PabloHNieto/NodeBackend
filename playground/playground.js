require("../src/db/mongoose");
const Task = require("../src/models/Task");


Task.findByIdAndUpdate("5d987412c2da6f117f9e480e",
  { completed: true})
  .then(() => {
    return Task.countDocuments({completed: true})
  })
  .then((result) => {
    console.log(result)
;  }) 
  .catch((e) => console.error(e)
);

const updateAgeCount = async () => {
  await Task.findByIdAndUpdate("5d987412c2da6f117f9e480e",
  { completed: true})
  return await Task.countDocuments({completed: true})
}

updateAgeCount().then((re) => console.log(re))
  .catch((err) => console.error(err))