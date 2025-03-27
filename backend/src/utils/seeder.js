const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const NewsItem = require('../models/NewsItem');

// Load environment variables
dotenv.config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    isAdmin: true,
  },
  {
    name: 'Doug',
    email: 'doug@example.com',
    password: 'password',
    isAdmin: false,
  },
];

const newsItems = [
  {
    title: 'Quarterly Report Summary',
    summary: 'Our Q1 results exceeded expectations with a 15% increase in revenue compared to last year. The team has been working diligently to improve our product offerings and customer service, which has resulted in higher customer satisfaction and retention rates.',
    link: 'https://example.com/report',
    date: new Date('2023-04-15'),
    isFavorite: false
  },
  {
    title: 'New Client Acquisition',
    summary: 'We have successfully onboarded XYZ Corp as a new client with an estimated annual contract value of $500K. This partnership opens up new opportunities in the manufacturing sector and strengthens our position in the market.',
    link: 'https://example.com/client',
    date: new Date('2023-04-10'),
    isFavorite: true
  },
  {
    title: 'Product Launch Update',
    summary: 'The new product launch is scheduled for May 15th. Marketing materials are ready for review, and the development team has completed all major features. We are now in the final testing phase to ensure a smooth launch.',
    link: 'https://example.com/product',
    date: new Date('2023-04-05'),
    isFavorite: false
  },
  {
    title: 'Team Expansion Plans',
    summary: 'We are planning to expand our development team by hiring 5 new engineers in Q3. The HR department has already started the recruitment process, and we expect to have the new team members onboarded by August.',
    link: 'https://example.com/expansion',
    date: new Date('2023-03-28'),
    isFavorite: false
  },
  {
    title: 'Industry Conference Highlights',
    summary: 'Our team attended the annual industry conference last week and gathered valuable insights on market trends and competitor strategies. A detailed report will be shared next week, but the key takeaway is that our product roadmap aligns well with industry direction.',
    link: 'https://example.com/conference',
    date: new Date('2023-03-20'),
    isFavorite: false
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing data
    await User.deleteMany();
    await NewsItem.deleteMany();
    console.log('Data cleared');
    
    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Create news items
    const createdNewsItems = await NewsItem.insertMany(newsItems);
    console.log(`${createdNewsItems.length} news items created`);
    
    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})
.catch(err => {
  console.error(`MongoDB connection error: ${err.message}`);
  process.exit(1);
});