const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", 
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

// const userSchema = new Schema({
  // `socialMediaHandles` is a map whose values are strings. A map's
  // keys are always strings. You specify the type of values using `of`.
//   socialMediaHandles: {
//     type: Map,
//     of: String
//   }
// });

// const MyUser = mongoose.model('MyUser', userSchema);
// // Map { 'github' => 'vkarpov15', 'twitter' => '@code_barbarian' }
// console.log(new MyUser({
//   socialMediaHandles: {
//     github: 'vkarpov15',
//     twitter: '@code_barbarian'
//   }
// }));