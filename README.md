# Doug's News Dashboard

A professional React application for sharing information with Doug in a newspaper-style format. The app features a clean, responsive interface built with Material UI v7, optimized for both desktop and mobile viewing. It includes a MongoDB backend for persistent data storage and user authentication.

## Features

- **News Feed**: View the latest updates with search functionality
- **Favorites**: Star important items to save them for later reference
- **Admin Panel**: Add new updates with title, summary, and source link
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Optimized for mobile devices
- **Material UI v7**: Professional and clean interface
- **MongoDB Backend**: Persistent data storage with MongoDB
- **Express API**: RESTful API for data management
- **TypeScript**: Type-safe code throughout the application

## Project Structure

```
boss-updates/
├── backend/                # Backend Express application
│   ├── src/
│   │   ├── controllers/    # API controllers for auth and news
│   │   │   ├── authController.js    # User authentication logic
│   │   │   └── newsController.js    # News item management
│   │   ├── middleware/     # Express middleware
│   │   │   └── authMiddleware.js    # JWT authentication middleware
│   │   ├── models/         # MongoDB models
│   │   │   ├── NewsItem.js          # News item schema
│   │   │   └── User.js              # User schema with password hashing
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js              # Authentication routes
│   │   │   └── news.js              # News item routes
│   │   ├── utils/          # Utility functions
│   │   │   └── seeder.js            # Database seeder for development
│   │   └── index.js        # Express server entry point
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables (create this file)
│
├── public/                 # Static assets
│
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx              # App header with navigation
│   │   ├── NewsItem.tsx            # Individual news item display
│   │   ├── NewsItemForm.tsx        # Form for adding/editing news
│   │   ├── NewsItemList.tsx        # List of news items
│   │   └── SearchBar.tsx           # Search functionality
│   │
│   ├── context/            # React context providers
│   │   ├── AuthContext.tsx         # Authentication state management
│   │   └── NewsContext.tsx         # News data state management
│   │
│   ├── pages/              # Page components
│   │   ├── AdminPage.tsx           # Admin dashboard for adding news
│   │   ├── FavoritesPage.tsx       # Saved/favorited news items
│   │   ├── LandingPage.tsx         # Public landing page
│   │   ├── LoginPage.tsx           # User authentication
│   │   └── NewsPage.tsx            # Main news feed
│   │
│   ├── services/           # API services
│   │   └── api.ts                  # Axios configuration and API calls
│   │
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts                # Shared type definitions
│   │
│   ├── App.tsx             # Main application component
│   ├── index.tsx           # Application entry point
│   └── theme.ts            # Material UI theme configuration
│
├── package.json            # Frontend dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/41rumble/boss-updates.git
   cd boss-updates
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables:**
   - Copy the `.env.example` file to `.env` in the `backend` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   - The example file contains these settings:
   ```
   MONGODB_URI=mongodb://localhost:27017/dougs-news
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   BYPASS_AUTH=true
   ```

   - For development, `BYPASS_AUTH=true` allows you to skip authentication
   - For production, set `NODE_ENV=production` and use a strong JWT_SECRET

5. **Seed the database (optional):**
   ```bash
   cd backend
   node src/utils/seeder.js
   ```
   This will create sample users and news items for development.

### Running the Application

1. **Start the backend server:**
   ```bash
   # From the backend directory
   npm run dev
   ```
   The server will run on http://localhost:5000

2. **Start the frontend development server:**
   ```bash
   # From the root directory
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Development Workflow

### Backend Development

The backend is built with Express.js and MongoDB. Key files:

- `backend/src/index.js`: Server configuration and startup
- `backend/src/controllers/`: Business logic for API endpoints
- `backend/src/models/`: MongoDB schemas and models
- `backend/src/routes/`: API route definitions

To add a new API endpoint:
1. Create or update a model in `models/`
2. Add controller logic in `controllers/`
3. Define routes in `routes/`
4. Register the routes in `index.js`

### Frontend Development

The frontend is built with React, TypeScript, and Material UI v7. Key concepts:

- **Context API**: Used for state management (`context/`)
- **TypeScript**: All components use TypeScript for type safety
- **Material UI**: UI components follow Material Design principles
- **Responsive Design**: All pages are mobile-friendly

To add a new feature:
1. Define types in `src/types/index.ts`
2. Create components in `src/components/`
3. Add API service methods in `src/services/api.ts`
4. Create or update pages in `src/pages/`

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Login**: Email and password authentication
- **Registration**: Create new user accounts
- **Protected Routes**: Admin features require authentication
- **Token Storage**: JWTs are stored in localStorage

Demo credentials:
- Email: any email address
- Password: "password"

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### News Items

- `GET /api/news` - Get all news items
- `GET /api/news/favorites` - Get favorited news items (protected)
- `POST /api/news` - Create a new news item (protected)
- `PUT /api/news/:id` - Update a news item (protected)
- `DELETE /api/news/:id` - Delete a news item (protected)
- `POST /api/news/:id/toggle-favorite` - Toggle favorite status (protected)

## Deployment

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `build` directory to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

### Backend Deployment

1. Set up environment variables on your hosting platform:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT signing
   - `NODE_ENV`: Set to "production"
   - `PORT`: Usually set automatically by the hosting platform

2. Deploy the backend code to a Node.js hosting service (Heroku, Render, DigitalOcean, etc.)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**:
   - Verify your MongoDB connection string in `.env`
   - Ensure MongoDB is running if using a local installation
   - Check network access if using MongoDB Atlas

2. **JWT Authentication Issues**:
   - Clear browser localStorage and try logging in again
   - Verify JWT_SECRET is set correctly in backend `.env`
   - For development, set `BYPASS_AUTH=true` in the backend `.env` file
   - Check browser console for authentication errors
   - If you see "jwt malformed" errors, try logging out and back in

3. **CORS Errors**:
   - During development, ensure backend is running on port 5000
   - If you see CORS errors, check that the backend is running and accessible
   - The backend is configured to allow all origins in development mode
   - If you're using a different frontend URL, update the CORS configuration in `backend/src/index.js`
   - For production, set `CORS_ORIGIN` in your environment variables

4. **TypeScript Errors**:
   - Run `npm run tsc` to check for type errors
   - Ensure all imports and types are correctly defined

## Future Enhancements

- **Categories**: Organize news items by category
- **Rich Text Editor**: Support for formatted content
- **Image Uploads**: Allow image attachments for news items
- **Push Notifications**: Real-time alerts for new items
- **Analytics**: Track which items are most viewed/favorited
- **Dark Mode**: Toggle between light and dark themes
- **Export**: Export favorites as PDF or email digest

## License

MIT
