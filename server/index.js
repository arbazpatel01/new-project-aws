const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeDatabase, saveContact, getAllContacts, getContactById, markAsRead, deleteContact } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
let dbInitialized = false;
initializeDatabase().then(success => {
  dbInitialized = success;
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// ============================================
// API Routes
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbInitialized ? 'connected' : 'disconnected'
  });
});

// App info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'AWS Lightsail Demo App',
    version: '1.0.0',
    description: 'A simple React + Node.js application deployed on AWS Lightsail',
    features: [
      'React Frontend',
      'Node.js Backend',
      'Express API',
      'MySQL Database',
      'Contact Form',
      'AWS Lightsail Ready'
    ]
  });
});

// ============================================
// Contact Form API Routes
// ============================================

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Save to database
    const result = await saveContact({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      id: result.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again later.'
    });
  }
});

// Get all contacts (admin endpoint)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contacts'
    });
  }
});

// Get single contact by ID
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact'
    });
  }
});

// Mark contact as read
app.patch('/api/contacts/:id/read', async (req, res) => {
  try {
    await markAsRead(req.params.id);
    res.json({
      success: true,
      message: 'Contact marked as read'
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact'
    });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await deleteContact(req.params.id);
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact'
    });
  }
});

// ============================================
// Serve static files from React build
// ============================================
// Serve static files from build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/build', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        error: 'Not Found',
        message: 'React build not found. Run "npm run build" in the client folder first.',
        path: indexPath
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`📝 Contact form endpoint: POST http://localhost:${PORT}/api/contact`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
