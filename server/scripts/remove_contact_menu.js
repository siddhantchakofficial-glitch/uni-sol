import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/unispark';

async function run() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    const Menu = mongoose.model('Menu', new mongoose.Schema({}, { strict: false }));
    const headerMenu = await Menu.findOne({ name: 'header' });
    if (headerMenu && Array.isArray(headerMenu.items)) {
      headerMenu.items = headerMenu.items.filter(
        item => item.label?.toLowerCase() !== 'contact' && item.url !== '/contact'
      );
      await headerMenu.save();
      console.log('Successfully updated header menu in MongoDB!');
    } else {
      console.log('No header menu found in MongoDB or no items.');
    }
  } catch (err) {
    console.log('MongoDB check/update skipped (offline or not accessible):', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
