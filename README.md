# Boss Updates App

A simple and secure React application for sharing information with your boss. The app features a clean, professional interface built with Material UI, optimized for both desktop and mobile viewing. It includes a MongoDB backend for persistent data storage.

## Features

- **News Feed**: View the latest updates with search functionality
- **Favorites**: Star important items to save them for later reference
- **Admin Panel**: Add new updates with title, summary, and source link
- **Responsive Design**: Optimized for mobile devices
- **Material UI**: Professional and clean interface
- **MongoDB Backend**: Persistent data storage with MongoDB Atlas
- **Express API**: RESTful API for data management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (or local MongoDB installation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/41rumble/boss-updates.git
   cd boss-updates
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the `backend` directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     CORS_ORIGIN=https://dougsnews.com
     ```

5. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

6. In a new terminal, start the React application:
   ```bash
   cd ..
   npm start
   ```

7. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
├── src/                  # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── types/            # TypeScript interfaces
│   └── context/          # React context providers
│
└── backend/              # Backend Express application
    ├── src/              # Backend source code
    │   ├── controllers/  # API controllers
    │   ├── models/       # MongoDB models
    │   └── routes/       # API routes
    └── .env              # Environment variables
```

## Usage

### Viewing Updates

The home page displays all updates with a search bar to filter content.

### Managing Favorites

Click the star icon on any update to add it to your favorites. Access all favorites from the "Favorites" tab.

### Adding New Updates

Navigate to the "Admin" tab to add new updates with title, summary, and source link.

## Available Scripts

### Frontend
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite

### Backend
- `npm start` - Runs the backend server
- `npm run dev` - Runs the backend server with nodemon for development

## Deployment

### Frontend
The frontend can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Backend
The backend can be deployed to services like Heroku, Render, or DigitalOcean.

For production deployment:
1. Build the React app: `npm run build`
2. Set the `NODE_ENV` environment variable to `production` for the backend
3. Configure the domain in the `.env` file

## Future Enhancements

- Authentication for admin access
- Categories for updates
- Rich text formatting for summaries
- Push notifications for new updates
- Offline support

## License

MIT
