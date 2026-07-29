#!/usr/bin/env node

/**
 * Load Testing Script for Nearby Vibes
 * Tests concurrent checkouts, batch operations, and trial expiration
 */

const http = require('http');
const https = require('https');

const CONFIG = {
  API_URL: process.env.API_URL || 'http://localhost:3001/api',
  DURATION_SECONDS: parseInt(process.env.DURATION || '60'),
  RPS: parseInt(process.env.RPS || '10'), // Requests per second
  CONCURRENT_USERS: parseInt(process.env.CONCURRENT_USERS || '5'),
  TEST_TYPE: process.env.TEST_TYPE || 'all', // all, checkout, signup, trial_expiry
};

let stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalDuration: 0,
  responseTimeSum: 0,
  responseTimeSqSum: 0,
  minResponseTime: Infinity,
  maxResponseTime: 0,
  errorsByType: {},
};

// Make HTTP request
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(CONFIG.API_URL + path);
    const startTime = Date.now();

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer test-token-${Math.random()}`,
      },
      timeout: 10000,
    };

    const protocol = url.protocol === 'https:' ? https : http;

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          duration,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data,
        });
      });
    });

    req.on('error', (err) => {
      const duration = Date.now() - startTime;
      reject({
        error: err.message,
        duration,
      });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test: Checkout creation (Paddle integration)
async function testCheckout() {
  return makeRequest('POST', '/subscriptions/checkout', {
    plan: 'premium',
    promoCode: null,
  });
}

// Test: Venue signup
async function testSignup() {
  const randomEmail = `venue-${Date.now()}-${Math.random()}@example.com`;
  return makeRequest('POST', '/auth/signup', {
    email: randomEmail,
    password: 'Test@12345',
    role: 'venue',
  });
}

// Test: Trial expiration batch job
async function testTrialExpiration() {
  return makeRequest('POST', '/subscriptions/admin/check-trial-expirations', {});
}

// Test: Fraud event review
async function testFraudQueue() {
  return makeRequest('GET', '/abuse-prevention/admin/fraud-queue?severity=high', null);
}

// Run load test scenario
async function runScenario() {
  const startTime = Date.now();
  const requests = [];

  while (Date.now() - startTime < CONFIG.DURATION_SECONDS * 1000) {
    const batchSize = Math.ceil(CONFIG.RPS / 10); // 100ms batches

    for (let i = 0; i < batchSize; i++) {
      let promise;

      switch (CONFIG.TEST_TYPE) {
        case 'checkout':
          promise = testCheckout();
          break;
        case 'signup':
          promise = testSignup();
          break;
        case 'trial_expiry':
          promise = testTrialExpiration();
          break;
        case 'fraud':
          promise = testFraudQueue();
          break;
        case 'all':
        default:
          const testType = Math.floor(Math.random() * 4);
          if (testType === 0) promise = testCheckout();
          else if (testType === 1) promise = testSignup();
          else if (testType === 2) promise = testTrialExpiration();
          else promise = testFraudQueue();
      }

      requests.push(
        promise
          .then((res) => {
            stats.totalRequests++;
            stats.responseTimeSum += res.duration;
            stats.responseTimeSqSum += res.duration * res.duration;
            stats.minResponseTime = Math.min(stats.minResponseTime, res.duration);
            stats.maxResponseTime = Math.max(stats.maxResponseTime, res.duration);

            if (res.success) {
              stats.successfulRequests++;
            } else {
              stats.failedRequests++;
              const key = `${res.statusCode}`;
              stats.errorsByType[key] = (stats.errorsByType[key] || 0) + 1;
            }
          })
          .catch((err) => {
            stats.totalRequests++;
            stats.failedRequests++;
            const key = err.error || 'Unknown';
            stats.errorsByType[key] = (stats.errorsByType[key] || 0) + 1;
          })
      );
    }

    // Wait 100ms before next batch
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Keep only recent promises to avoid memory issues
    if (requests.length > 1000) {
      await Promise.all(requests.splice(0, 500));
    }
  }

  // Wait for remaining requests
  await Promise.all(requests);
  stats.totalDuration = Date.now() - startTime;
}

// Print results
function printResults() {
  console.log('\n=== Nearby Vibes Load Test Results ===\n');
  console.log(`Test Type: ${CONFIG.TEST_TYPE}`);
  console.log(`Duration: ${(stats.totalDuration / 1000).toFixed(2)}s`);
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Successful: ${stats.successfulRequests} (${((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2)}%)`);
  console.log(`Failed: ${stats.failedRequests} (${((stats.failedRequests / stats.totalRequests) * 100).toFixed(2)}%)`);

  const avgResponseTime = stats.responseTimeSum / stats.totalRequests;
  const stdDeviation = Math.sqrt(
    stats.responseTimeSqSum / stats.totalRequests - avgResponseTime * avgResponseTime
  );

  console.log(`\nResponse Time (ms):`);
  console.log(`  Min: ${stats.minResponseTime.toFixed(2)}`);
  console.log(`  Avg: ${avgResponseTime.toFixed(2)}`);
  console.log(`  Max: ${stats.maxResponseTime.toFixed(2)}`);
  console.log(`  StdDev: ${stdDeviation.toFixed(2)}`);
  console.log(`  RPS: ${(stats.totalRequests / (stats.totalDuration / 1000)).toFixed(2)}`);

  if (Object.keys(stats.errorsByType).length > 0) {
    console.log(`\nErrors:`);
    Object.entries(stats.errorsByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }

  console.log('\n=== Load Test Complete ===\n');
}

// Main
(async () => {
  console.log('Starting load test...');
  console.log(`API: ${CONFIG.API_URL}`);
  console.log(`Duration: ${CONFIG.DURATION_SECONDS}s`);
  console.log(`RPS: ${CONFIG.RPS}`);
  console.log(`Test Type: ${CONFIG.TEST_TYPE}\n`);

  try {
    await runScenario();
    printResults();
    process.exit(0);
  } catch (err) {
    console.error('Load test failed:', err);
    process.exit(1);
  }
})();
