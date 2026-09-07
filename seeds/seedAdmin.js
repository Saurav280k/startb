import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}`);

    const adminEmail = 'admin@modernteams.com';
    const adminPassword = 'Admin@2026';
    const adminUsername = 'Modern Teams Admin';

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (admin) {
      console.log(`Admin user already exists with email: ${adminEmail}`);
      admin.role = 'admin';
      admin.username = adminUsername;
      admin.password = adminPassword; // User model pre-save hook will hash this
      await admin.save();
      console.log(`Admin credentials updated successfully!`);
    } else {
      admin = await User.create({
        username: adminUsername,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
        phone: '9876543210',
      });
      console.log(`Created new Admin user successfully: ${admin.email}`);
    }

    console.log(`========================================`);
    console.log(`Admin Credentials:`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     admin`);
    console.log(`========================================`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
