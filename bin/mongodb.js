require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    const mongoUri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : process.env.DB_URL;    
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB ${process.env.NODE_ENV === 'production' ? 'Atlas' : 'Local'} ok`);
    console.log('Current environment:', process.env.NODE_ENV);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongoDB();

module.exports = mongoose;

