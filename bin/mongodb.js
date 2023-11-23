const mongoose = require('mongoose');


async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/loSportafoglio');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

connectToMongoDB();


module.exports = mongoose;