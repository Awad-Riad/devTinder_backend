const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://awadabomosa52:CkS0jcmn6pmzRYQO@my-node-api-cluster.pzcy4.mongodb.net/devTinder"
  );
};

module.exports=connectDB

