require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Import Routes
const projectRoutes = require('./routes/projectRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

// Use Routes
app.use('/projects', projectRoutes);
app.use('/clients', clientRoutes);
app.use('/contact', contactRoutes);
app.use('/subscribe', subscriberRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));