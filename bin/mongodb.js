require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas ok');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongoDB();


module.exports = mongoose;
