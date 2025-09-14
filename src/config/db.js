const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_DEVELOPMENT
      : process.env.MONGO_URI_PRODUCTION
  );
};

module.exports = connectDB;
