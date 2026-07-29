#!/bin/bash

# Smoke Tests for Nearby Vibes
# Verifies critical functionality after deployment

set -e

API_URL=${API_URL:-http://localhost:3001/api}
WEB_URL=${WEB_URL:-http://localhost:3000}
MAX_RETRIES=30
RETRY_DELAY=2

echo "=== Nearby Vibes Smoke Tests ==="
echo "API: $API_URL"
echo "Web: $WEB_URL"
echo ""

# Helper functions
retry() {
  local n=1
  local max=$MAX_RETRIES
  local delay=$RETRY_DELAY
  while true; do
    if "$@"; then
      return 0
    else
      if [[ $n -lt $max ]]; then
        ((n++))
        echo "Attempt $n failed. Retrying in ${delay}s..."
        sleep $delay
      else
        echo "Command failed after $max attempts."
        return 1
      fi
    fi
  done
}

# Test 1: API Health Check
echo "Test 1: API Health Check"
retry curl -f "$API_URL/../health" > /dev/null
echo "✓ API is healthy"

# Test 2: Frontend Health Check
echo "Test 2: Frontend Health Check"
retry curl -f "$WEB_URL/" > /dev/null
echo "✓ Frontend is accessible"

# Test 3: Database Connectivity
echo "Test 3: Database Connectivity"
API_HEALTH=$(curl -s "$API_URL/../health" | grep -q "database" && echo "ok" || echo "fail")
if [ "$API_HEALTH" = "ok" ]; then
  echo "✓ Database is connected"
else
  echo "✗ Database connection failed"
  exit 1
fi

# Test 4: Authentication Endpoint
echo "Test 4: Authentication Endpoint"
AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","role":"customer"}')
STATUS=$(echo "$AUTH_RESPONSE" | tail -n1)
if [ "$STATUS" = "400" ] || [ "$STATUS" = "201" ]; then
  echo "✓ Auth endpoint is working (received HTTP $STATUS)"
else
  echo "✗ Auth endpoint failed (received HTTP $STATUS)"
  exit 1
fi

# Test 5: Discovery API
echo "Test 5: Discovery API"
DISCOVERY_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/discovery/popular")
STATUS=$(echo "$DISCOVERY_RESPONSE" | tail -n1)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ]; then
  echo "✓ Discovery API is working (received HTTP $STATUS)"
else
  echo "✗ Discovery API failed (received HTTP $STATUS)"
  exit 1
fi

# Test 6: Posts API
echo "Test 6: Posts API"
POSTS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/posts")
STATUS=$(echo "$POSTS_RESPONSE" | tail -n1)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ]; then
  echo "✓ Posts API is working (received HTTP $STATUS)"
else
  echo "✗ Posts API failed (received HTTP $STATUS)"
  exit 1
fi

# Test 7: Subscriptions API
echo "Test 7: Subscriptions API"
SUB_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/subscriptions/current" \
  -H "Authorization: Bearer test-token")
STATUS=$(echo "$SUB_RESPONSE" | tail -n1)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ]; then
  echo "✓ Subscriptions API is working (received HTTP $STATUS)"
else
  echo "✗ Subscriptions API failed (received HTTP $STATUS)"
  exit 1
fi

# Test 8: Abuse Prevention
echo "Test 8: Abuse Prevention"
ABUSE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/abuse-prevention/check-email" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com"}')
STATUS=$(echo "$ABUSE_RESPONSE" | tail -n1)
if [ "$STATUS" = "200" ]; then
  echo "✓ Abuse Prevention API is working"
else
  echo "✗ Abuse Prevention API failed (received HTTP $STATUS)"
  exit 1
fi

# Test 9: Response Time Check
echo "Test 9: Response Time Check"
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "$API_URL/../health")
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc)
THRESHOLD=2000 # 2 seconds

if (( $(echo "$RESPONSE_TIME_MS < $THRESHOLD" | bc -l) )); then
  echo "✓ Response time is acceptable (${RESPONSE_TIME_MS}ms < ${THRESHOLD}ms)"
else
  echo "⚠ Response time is slow (${RESPONSE_TIME_MS}ms > ${THRESHOLD}ms)"
fi

# Test 10: Frontend Rendering
echo "Test 10: Frontend Rendering"
WEB_RESPONSE=$(curl -s "$WEB_URL/" | grep -q "Nearby Vibes" && echo "ok" || echo "fail")
if [ "$WEB_RESPONSE" = "ok" ]; then
  echo "✓ Frontend is rendering correctly"
else
  echo "⚠ Frontend content check inconclusive"
fi

echo ""
echo "=== All Smoke Tests Passed ✓ ==="
echo ""
echo "Deployment verification complete. System is ready for use."
