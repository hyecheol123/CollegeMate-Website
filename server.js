/**
 * Express.js API server to proxy UW-Madison enrollment API
 * Solves CORS issues for local development
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Express API server is running' });
});

// Proxy endpoint for UW-Madison terms API
app.get('/api/terms', async (req, res) => {
  try {
    console.log('🔄 Proxying request to UW-Madison enrollment API...');
    
    // Fetch data from UW-Madison API
    const response = await fetch('https://public.enroll.wisc.edu/api/search/v1/aggregate', {
      method: 'GET',
      headers: {
        'User-Agent': 'CollegeMate-API-Proxy/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`UW-Madison API returned status ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Successfully fetched terms from UW-Madison API');
    console.log(`📊 Found ${data.terms?.length || 0} terms`);
    
    // Return the data to frontend
    res.json(data);
    
  } catch (error) {
    console.error('❌ Error proxying UW-Madison API:', error.message);
    
    res.status(500).json({
      error: 'Failed to fetch terms from UW-Madison API',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Express API server running on http://localhost:${PORT}`);
  console.log(`📡 Terms endpoint: http://localhost:${PORT}/api/terms`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Keep this server running');
  console.log('2. In another terminal, run: npm run dev');
  console.log('3. Frontend will fetch terms from this proxy server');
});