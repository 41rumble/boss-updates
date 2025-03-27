# Boss Updates App

A simple and secure React application for sharing information with your boss. The app features a clean, professional interface built with Material UI, optimized for both desktop and mobile viewing.

## Features

- **News Feed**: View the latest updates with search functionality
- **Favorites**: Star important items to save them for later reference
- **Admin Panel**: Add new updates with title, summary, and source link
- **Responsive Design**: Optimized for mobile devices
- **Material UI**: Professional and clean interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/boss-updates.git
   cd boss-updates
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the mock API server:
   ```bash
   npm run server
   ```

4. In a new terminal, start the React application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/           # Page components
├── services/        # API services
├── types/           # TypeScript interfaces
└── context/         # React context providers
```

## Usage

### Viewing Updates

The home page displays all updates with a search bar to filter content.

### Managing Favorites

Click the star icon on any update to add it to your favorites. Access all favorites from the "Favorites" tab.

### Adding New Updates

Navigate to the "Admin" tab to add new updates with title, summary, and source link.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run server` - Starts the mock JSON server API

## Future Enhancements

- Authentication for admin access
- Categories for updates
- Rich text formatting for summaries
- Push notifications for new updates
- Offline support

## License

MIT
