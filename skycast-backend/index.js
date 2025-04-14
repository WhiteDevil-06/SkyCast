require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const weatherRoutes = require('./routes/weather');

const app = express();

// Helmet for headers
app.use(helmet());

// CORS
const corsOptions = {
  origin: '*', // After deploy, replace with your frontend domain
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: '🚫 Too many requests, try again later.',
});
app.use(limiter);

// JSON parsing
app.use(express.json());

// API Routes
app.use('/api/weather', weatherRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('🌐 SkyCast Backend is up and running!');
});

// ⚙️ Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
  });
}

// ✈️ Vercel needs this
module.exports = app;
