# Flight Ticket Booking System

A comprehensive web application for booking flight tickets with both admin and client functionality. Built with Node.js, Express, MongoDB, and EJS templating.

## Features

### User Features
- User registration and authentication
- Browse available flights with search functionality
- Search flights by source, destination, and date
- View flight details
- Book flights with passenger information
- View booking history
- Responsive design

### Admin Features
- Admin authentication and dashboard
- Manage flights (CRUD operations)
- View all bookings and users
- Statistics dashboard
- Secure admin panel

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with local strategy
- **Frontend**: EJS templating, Bootstrap 4
- **Session Management**: Express-session
- **Password Hashing**: Passport-local-mongoose

## Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flight-ticket-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `config.env` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/flight_booking
   # For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/flight_booking

   # Session Secret
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production

   # Port Configuration
   PORT=3000

   # Admin Credentials (for initial setup)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ADMIN_EMAIL=admin@flightbooking.com
   ```

4. **Initialize the database**
   ```bash
   npm run init
   ```
   This will create:
   - Admin account
   - Sample flights
   - Demo user account

5. **Start the application**
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

## Default Credentials

After running the initialization script:

### Admin Account
- **Username**: admin
- **Password**: admin123
- **Access**: http://localhost:3000/admin/login

### Demo User Account
- **Username**: demo
- **Password**: demo123
- **Access**: http://localhost:3000/login

## API Endpoints

### User Routes
- `GET /` - Landing page
- `GET /register` - User registration page
- `POST /register` - User registration
- `GET /login` - User login page
- `POST /login` - User login
- `GET /logout` - User logout
- `GET /home` - Browse flights (requires authentication)
- `GET /home/:id` - Flight details
- `GET /home/:id/book` - Booking page
- `POST /home/:id/book/bill` - Create booking
- `GET /my-bookings` - User's booking history

### Admin Routes
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Admin login
- `GET /admin/logout` - Admin logout
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/flights` - Manage flights
- `GET /admin/flights/new` - Add new flight
- `POST /admin/flights` - Create flight
- `GET /admin/flights/:id` - Flight details
- `GET /admin/flights/:id/edit` - Edit flight
- `PUT /admin/flights/:id` - Update flight
- `DELETE /admin/flights/:id` - Delete flight
- `GET /admin/users` - View all users
- `GET /admin/bookings` - View all bookings

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  name: String (required),
  address: String,
  number: Number,
  createdAt: Date
}
```

### Flight Model
```javascript
{
  name: String (required),
  source: String (required),
  destination: String (required),
  duration: Number (required),
  ar_time: Number (required),
  dp_time: Number (required),
  price: Number (required),
  date: Date (required),
  airline: String (required),
  seats: Number (default: 100),
  createdAt: Date
}
```

### Booking Model
```javascript
{
  quantity: Number (required),
  price: Number (required),
  booker: { id: ObjectId (ref: User) },
  full_name: String (required),
  username: String (required),
  address: String (required),
  city: String (required),
  flight: ObjectId (ref: Flight),
  status: String (enum: ['confirmed', 'cancelled', 'pending']),
  bookingDate: Date
}
```

### Admin Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  name: String (required),
  createdAt: Date
}
```

## Security Features

- Password hashing using passport-local-mongoose
- Session-based authentication
- CSRF protection with method-override
- Input validation and sanitization
- Secure session configuration
- Environment variable management

## Error Handling

- Comprehensive error handling middleware
- User-friendly error messages
- Flash message system for user feedback
- 404 page for invalid routes
- Database connection error handling

## Search Functionality

Users can search flights by:
- Source city
- Destination city
- Date
- Combination of all three

## Responsive Design

- Bootstrap 4 for responsive layout
- Mobile-friendly navigation
- Responsive tables and forms
- Modern UI with aviation-themed background

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
Make sure to set appropriate environment variables:
- `MONGODB_URI` - Production database URL
- `SESSION_SECRET` - Strong session secret
- `PORT` - Application port
- `NODE_ENV` - Set to 'production'

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.

## Changelog

### Version 1.0.0
- Initial release
- User authentication and registration
- Flight booking system
- Admin panel
- Search functionality
- Responsive design
- Database initialization script

