Advanced URL Shortener API
A powerful URL shortening service with comprehensive analytics, custom aliases, and rate limiting capabilities. This API allows users to create shortened URLs, track their performance, and analyze usage patterns across different devices and operating systems.
Live Demo
API Base URL: https://url-shortener-dxn4.onrender.com
Features

URL Shortening

Create short URLs with optional custom aliases
Topic-based URL grouping (acquisition, activation, retention)
Rate limiting to prevent abuse


Authentication

JWT-based authentication system
Secure user registration and login


Advanced Analytics

Detailed click tracking and user engagement metrics
Device and OS-based analytics
Topic-wise URL performance analysis
Overall usage statistics


Performance Optimization

Redis caching implementation
Efficient database queries
Repository pattern for clean architecture



API Endpoints
Authentication
CopyPOST /api/register - Register new user
POST /api/login - User login
URL Operations
CopyPOST /api/shorten - Create short URL
GET /api/shorten/{alias} - Redirect to original URL
Analytics
CopyGET /api/analytics/{alias} - Get specific URL analytics
GET /api/analytics/topic/{topic} - Get topic-based analytics
GET /api/analytics/overall - Get overall analytics
Technology Stack

Backend: Node.js
Database: MongoDB
Caching: Redis
Architecture: Repository Pattern
Authentication: JWT
Deployment: Docker & Render

Installation

Clone the repository:

bashCopygit clone <repository-url>
cd URL_SHORTENER_BACKEND

Install dependencies:

npm install

Set up environment variables:

Run the application:

 Development mode
npm run build

# Production mode
npm start
Docker Setup

Build the Docker image:

docker build -t skahaye2002/url-shortener .

Run the container:

docker run -p 3000:3000 url-shortener
API Response Examples
Create Short URL
POST /api/shorten
{
  "longUrl": "https://example.com/very-long-url",
  "customAlias": "my-custom-link",
  "topic": "acquisition"
}

Response:
{
  "shortUrl": "https://url-shortener-dxn4.onrender.com/my-custom-link",
  "createdAt": "2024-01-21T10:00:00Z"
}
Get URL Analytics
jsonCopyGET /api/analytics/{alias}
{
  "totalClicks": 150,
  "uniqueUsers": 120,
  "clicksByDate": [
    {
      "date": "2024-01-21",
      "clicks": 25
    }
  ],
  "osType": [
    {
      "osName": "Windows",
      "uniqueClicks": 80,
      "uniqueUsers": 65
    }
  ],
  "deviceType": [
    {
      "deviceName": "desktop",
      "uniqueClicks": 100,
      "uniqueUsers": 85
    }
  ]
}
Architecture Overview
The application follows the repository pattern to ensure clean separation of concerns:

Controllers handle HTTP requests and responses
Services contain business logic
Repositories manage data access
Middleware handles authentication and rate limiting

Rate Limiting
The API implements rate limiting to prevent abuse:

5 requests per hour for URL creation for Users


Future Improvements

Enhanced security features
Advanced caching strategies
Analytics export functionality
Bulk URL creation
Custom domain support

Contributing

Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Create a Pull Request
