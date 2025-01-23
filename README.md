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
cd URL-Shortener
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file with:
MONGODB_URI="mongodb+srv://akshaykumar2002817:O6sEM0bfdGSX00f2@cluster0.fvc7c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=idfaisdfaskdfnalsmdfkasasdfasdfasd

```

4. Run the application
```bash
npm start
```

## 🐳 Docker Deployment

```bash
docker build -t akshaye2002/url-shortener .  
docker push  akshaye2002/url-shortener:latest
```

## 🚧 Challenges & Solutions

- **Rate Limiting**: Implemented token bucket algorithm
- **Caching**: Used Redis for efficient URL lookup
- **Analytics**: Designed scalable data collection mechanism

## 🔜 Future Improvements
- [ ] OAuth with multiple providers
- [ ] Enhanced link management dashboard
- [ ] Real-time analytics visualization



## 👥 Contributors

Akshay E

---

**Happy Link Shortening!** 🎉
