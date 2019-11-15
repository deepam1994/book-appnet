const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  const uri =
    "mongodb+srv://Deepa:hnda0ryvuQKad0mG@cluster0-veesy.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    _db = client.db();
    callback();
    client.close();
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
