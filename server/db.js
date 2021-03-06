const mongoose = require('mongoose');

async function connectDB() {
  try {
    // connect to db
    const mongoServer = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected: ${mongoServer.connection.host}`);
  } catch (err) {
    // log error
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDB;
