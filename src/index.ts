import express from 'express';
import dotenv from 'dotenv';
import connectDB from './util/database';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import userRouter from './routes/user.route';
import urlRouter from './routes/url.route';
import cookieParser from 'cookie-parser';
// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(session({
  secret: 'your-secret-key',  
  resave: false,       
  saveUninitialized: false,   
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter);
app.use('/', urlRouter);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); 
  }
};

startServer();

