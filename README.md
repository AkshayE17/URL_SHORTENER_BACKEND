# 🔗 Advanced URL Shortener with Analytics

## 🌟 Project Overview

A powerful URL shortening service that goes beyond simple link compression. This application offers:
- 🔐 Secure user authentication
- 🏷️ Custom URL aliases
- 📊 Comprehensive link analytics
- 🚀 High-performance caching
- 🛡️ Rate limiting to prevent abuse

## 🚀 Live Demo

**Application URL**: https://url-shortener-dxn4.onrender.com

## ✨ Features

### 1. URL Shortening
- Create short, manageable links from long URLs
- Optional custom aliases
- Group links by topics (acquisition, activation, retention)

### 2. Advanced Analytics
- Track total clicks and unique users
- Detailed OS and device type analytics
- Granular insights by URL or topic

### 3. Caching & Performance
- Redis-powered caching
- Optimized URL retrieval and redirection

## 🛠️ Tech Stack

- **Backend**: Node.js
- **Database**: MongoDB
- **Caching**: Redis
- **Deployment**: Render
- **Containerization**: Docker

## 🔧 API Endpoints

### URL Shortening
- `POST /api/shorten`: Create short URL
- `GET /api/shorten/{alias}`: Redirect to original URL

### Analytics
- `GET /api/analytics/{alias}`: URL-specific analytics
- `GET /api/analytics/topic/{topic}`: Topic-based analytics
- `GET /api/analytics/overall`: Comprehensive user analytics

## 🏁 Getting Started

### Prerequisites
- Node.js
- MongoDB
- Redis
- npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd url-shortener
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file with:
MONGODB_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
```

4. Run the application
```bash
npm start
```

## 🐳 Docker Deployment

```bash
docker build -t url-shortener .
docker run -p 3000:3000 url-shortener
```

## 🚧 Challenges & Solutions

- **Rate Limiting**: Implemented token bucket algorithm
- **Caching**: Used Redis for efficient URL lookup
- **Analytics**: Designed scalable data collection mechanism

## 🔜 Future Improvements
- [ ] OAuth with multiple providers
- [ ] Enhanced link management dashboard
- [ ] Real-time analytics visualization

## 📄 License

MIT License

## 👥 Contributors

Akshay E

---

**Happy Link Shortening!** 🎉
