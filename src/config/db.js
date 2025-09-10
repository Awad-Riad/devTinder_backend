const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGO_URI ||
      "mongodb+srv://awadabomosa52:CkS0jcmn6pmzRYQO@my-node-api-cluster.pzcy4.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
