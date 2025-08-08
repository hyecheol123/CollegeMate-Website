/**
 * Express.js API server to proxy UW-Madison enrollment API
 * Solves CORS issues for local development
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Express API server is running' });
});

// Proxy endpoint for UW-Madison terms API
app.get('/api/terms', async (_req, res) => {
  try {
    console.log('🔄 Proxying request to UW-Madison enrollment API...');

    // Fetch data from UW-Madison API
    const response = await fetch(
      'https://public.enroll.wisc.edu/api/search/v1/aggregate',
      {
        method: 'GET',
        headers: {
          'User-Agent': 'CollegeMate-API-Proxy/1.0',
          Accept: 'application/json',
        },
      },
    );

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
      timestamp: new Date().toISOString(),
    });
  }
});

// Proxy endpoint for UW-Madison class search API
app.post('/api/search', async (req, res) => {
  try {
    // Pass through all fields from the request
    const searchPayload = {
      ...req.body,
    };

    // Fetch data from UW-Madison search API
    const response = await fetch(
      'https://public.enroll.wisc.edu/api/search/v1',
      {
        method: 'POST',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchPayload),
      },
    );

    if (!response.ok) {
      throw new Error(
        `UW-Madison Search API returned status ${response.status}`,
      );
    }

    const data = await response.json();

    // Return the data to frontend
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to search classes from UW-Madison API',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Proxy endpoint for UW-Madison course details API
app.get(
  '/api/course-details/:termCode/:subjectCode/:courseId',
  async (req, res) => {
    try {
      const { termCode, subjectCode, courseId } = req.params;

      // Construct the URL for the UW-Madison course details API
      const apiUrl = `https://public.enroll.wisc.edu/api/search/v1/enrollmentPackages/${termCode}/${encodeURIComponent(subjectCode)}/${courseId}`;

      console.log('🎯 UW-MADISON API CALL:');
      console.log(`   URL: ${apiUrl}`);
      console.log('   Method: GET');
      console.log(
        `   Params: termCode=${termCode}, subjectCode="${decodeURIComponent(subjectCode)}", courseId=${courseId}`,
      );

      // Fetch data from UW-Madison course details API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'CollegeMate-API-Proxy/1.0',
          Accept: 'application/json',
        },
      });

      console.log(`   Response Status: ${response.status}`);

      if (!response.ok) {
        throw new Error(
          `UW-Madison Course Details API returned status ${response.status}`,
        );
      }

      const data = await response.json();

      console.log('   Response Data:', JSON.stringify(data, null, 2));

      // Return the data to frontend
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch course details from UW-Madison API',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Express API server running on http://localhost:${PORT}`);
  console.log(`📡 Terms endpoint: http://localhost:${PORT}/api/terms`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search`);
  console.log(
    `📚 Course details: http://localhost:${PORT}/api/course-details/:termCode/:subjectCode/:courseId`,
  );
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('🎯 Next steps:');
  console.log('1. Keep this server running');
  console.log('2. In another terminal, run: npm run dev');
  console.log('3. Frontend will fetch data from this proxy server');
});
