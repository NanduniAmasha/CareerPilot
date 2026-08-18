const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null
        });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  // Test 1: Unknown API route → 404
  console.log('Test 1: Unknown API route → 404');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/unknown',
      method: 'GET'
    });
    console.log(`  Status: ${res.status} ${res.status === 404 ? '✅' : '❌'}`);
    console.log(`  Response: ${JSON.stringify(res.body)}\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  // Test 2: Wrong login → proper message
  console.log('Test 2: Wrong login → proper message');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'wrong@test.com', password: 'wrongpass' }
    });
    console.log(`  Status: ${res.status} ${res.status === 401 ? '✅' : '❌'}`);
    console.log(`  Message: "${res.body.message}" ${res.body.message === 'Invalid email or password' ? '✅' : '❌'}\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  // Test 3: Duplicate registration attempt
  console.log('Test 3: Register first user');
  let testEmail = `test${Date.now()}@test.com`;
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { name: 'Test User', email: testEmail, password: 'password123' }
    });
    console.log(`  Status: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);
    console.log(`  Response: ${JSON.stringify(res.body)}\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  // Test 4: Duplicate registration → proper message
  console.log('Test 4: Duplicate registration → proper message');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { name: 'Test User 2', email: testEmail, password: 'password456' }
    });
    console.log(`  Status: ${res.status} ${res.status === 409 ? '✅' : '❌'}`);
    console.log(`  Message contains "already exists": ${res.body.message.includes('already exists') ? '✅' : '❌'}`);
    console.log(`  Full Message: "${res.body.message}"\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  // Test 5: Invalid JWT → should be rejected
  console.log('Test 5: Invalid JWT → should be rejected');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/applications',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid.jwt.token'
      }
    });
    console.log(`  Status: ${res.status} ${res.status === 401 ? '✅' : '❌'}`);
    console.log(`  Message: "${res.body.message}" ${res.body.message.includes('Invalid') || res.body.message.includes('token') ? '✅' : '❌'}\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  // Test 6: Missing JWT → should be rejected
  console.log('Test 6: Missing JWT → should be rejected');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/applications',
      method: 'GET'
    });
    console.log(`  Status: ${res.status} ${res.status === 401 ? '✅' : '❌'}`);
    console.log(`  Message: "${res.body.message}" ${res.body.message.includes('token') ? '✅' : '❌'}\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  // Test 7: Invalid application data (missing required fields)
  console.log('Test 7: Invalid application data (missing required fields)');
  try {
    const loginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: testEmail, password: 'password123' }
    });
    const token = loginRes.body.token;

    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/applications',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: { company: 'Test Co' }  // Missing position and other required fields
    });
    console.log(`  Status: ${res.status}`);
    console.log(`  Response: ${JSON.stringify(res.body)}`);
    console.log(`  Has error message: ${res.body.message ? '✅' : '❌'}\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  // Test 8: Health check
  console.log('Test 8: Health check');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    console.log(`  Status: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);
    console.log(`  Response: ${JSON.stringify(res.body)}\n`);
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}\n`);
  }

  console.log('✅ Test suite complete!');
  process.exit(0);
}

runTests().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
