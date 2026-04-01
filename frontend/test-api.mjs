#!/usr/bin/env node

/**
 * API Testing Script for Phase 2
 * Tests all CRUD endpoints and analysis API
 * 
 * Usage: node test-api.mjs
 * Make sure dev server is running: npm run dev
 */

const API_BASE = 'http://localhost:3000/api';

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, fn) {
  try {
    log(`\n📝 Testing: ${name}`, 'blue');
    const result = await fn();
    log(`✅ PASS: ${name}`, 'green');
    return { name, passed: true, result };
  } catch (error) {
    log(`❌ FAIL: ${name}`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return { name, passed: false, error: error.message };
  }
}

// Test helper
async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, options);
  
  if (!response.ok && response.status !== 404) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`${response.status}: ${error.error || error.message}`);
  }
  
  return { status: response.status, data: await response.json() };
}

// Test suite
const tests = [
  {
    name: '1. GET /api/applications (List All)',
    fn: async () => {
      const { data } = await api('/applications');
      if (!Array.isArray(data)) throw new Error('Expected array');
      log(`   Found ${data.length} applications`, 'yellow');
      return data;
    }
  },
  
  {
    name: '2. POST /api/applications (Create)',
    fn: async () => {
      const testApp = {
        Application: 'API Test Application',
        'Program Name': 'Test Program',
        'Prod URL': '',
        'Public Access?': 'No',
        'Technology Stack': 'Node.js Test',
        'Product Owner': 'Test Owner',
        'Product Contact': 'test@noaa.gov',
        'Number of Users': 42,
        Purpose: 'This is a test application created by the API test script'
      };
      
      const { data, status } = await api('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testApp)
      });
      
      if (status !== 201) throw new Error(`Expected 201, got ${status}`);
      if (!data.id) throw new Error('No ID in response');
      
      log(`   Created app with ID: ${data.id}`, 'yellow');
      return data;
    }
  },
  
  {
    name: '3. GET /api/applications/:id (Get One)',
    fn: async (previousResults) => {
      const createdApp = previousResults[1].result;
      if (!createdApp || !createdApp.id) {
        throw new Error('No app ID from previous test');
      }
      
      const { data } = await api(`/applications/${createdApp.id}`);
      
      if (data.Application !== 'API Test Application') {
        throw new Error('Retrieved app does not match');
      }
      
      log(`   Retrieved: ${data.Application}`, 'yellow');
      return data;
    }
  },
  
  {
    name: '4. PUT /api/applications/:id (Update)',
    fn: async (previousResults) => {
      const createdApp = previousResults[1].result;
      if (!createdApp || !createdApp.id) {
        throw new Error('No app ID from previous test');
      }
      
      const update = {
        Purpose: 'Updated purpose - API test successful!',
        'Number of Users': 100
      };
      
      const { data } = await api(`/applications/${createdApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
      
      if (data.Purpose !== update.Purpose) {
        throw new Error('Update failed');
      }
      
      log(`   Updated successfully`, 'yellow');
      return data;
    }
  },
  
  {
    name: '5. DELETE /api/applications/:id (Delete)',
    fn: async (previousResults) => {
      const createdApp = previousResults[1].result;
      if (!createdApp || !createdApp.id) {
        throw new Error('No app ID from previous test');
      }
      
      const { data } = await api(`/applications/${createdApp.id}`, {
        method: 'DELETE'
      });
      
      if (!data.success) {
        throw new Error('Delete did not return success');
      }
      
      log(`   Deleted app ${createdApp.id}`, 'yellow');
      return data;
    }
  },
  
  {
    name: '6. POST /api/analysis (Run Analysis)',
    fn: async () => {
      log(`   This may take a few seconds...`, 'yellow');
      const { data } = await api('/analysis', {
        method: 'POST'
      });
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('No results array in response');
      }
      
      if (!data.summary) {
        throw new Error('No summary in response');
      }
      
      log(`   Analyzed ${data.results.length} applications`, 'yellow');
      log(`   Average RICE score: ${data.summary.averageScore?.toFixed(2) || 'N/A'}`, 'yellow');
      return data;
    }
  },
  
  {
    name: '7. GET /api/analysis (Get Latest)',
    fn: async () => {
      const { data } = await api('/analysis');
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('No results in saved analysis');
      }
      
      log(`   Retrieved ${data.results.length} results`, 'yellow');
      return data;
    }
  }
];

// Run all tests
async function runTests() {
  log('\n🧪 Starting API Test Suite\n', 'blue');
  log('=' .repeat(50), 'blue');
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, () => test.fn(results));
    results.push(result);
    
    // Stop on critical failure
    if (!result.passed && test.name.includes('POST') && test.name.includes('Create')) {
      log('\n❌ Critical failure - stopping tests', 'red');
      break;
    }
  }
  
  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log('\n📊 Test Summary:\n', 'blue');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌';
    const color = r.passed ? 'green' : 'red';
    log(`${icon} ${r.name}`, color);
  });
  
  log(`\n${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Ready to merge Phase 2! 🎉\n', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed. Please review errors above.\n', 'yellow');
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await fetch(API_BASE.replace('/api', ''));
    return true;
  } catch (error) {
    return false;
  }
}

// Main
async function main() {
  log('🔍 Checking if dev server is running...', 'blue');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('\n❌ Dev server is not running!', 'red');
    log('\nPlease start it first:', 'yellow');
    log('  cd frontend && npm run dev\n', 'yellow');
    process.exit(1);
  }
  
  log('✅ Dev server is running\n', 'green');
  
  await runTests();
}

main().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
