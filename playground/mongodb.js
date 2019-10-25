const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = "mongodb://127.0.0.1:27017";
const database = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true},
  (err, client) => {
    if (err) return console.log("Unable to connect")
    
    const db = client.db(database);
    db.collection("users").insertOne({
      name: "PHN",
      age: 27
    }, (err, res) => {
      if (err) return console.log(err)
      console.log(res);
    })

    db.collection("tasks").insertMany([
      { title: "clean",
        project: "House" },
      { title: "Read",
        project: "Self" },
      { title: "Write",
        project: "Thesis" },
    ]
    , (err, res) => {
      if (err) return console.log(err)
      console.log(res);
    })

    const id = new ObjectID();
    console.log(id, id.getTimestamp());

  });
