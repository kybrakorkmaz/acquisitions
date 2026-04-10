#!/bin/bash
# JWT Authentication Testing Script with HTTPie
# Requirements: HTTPie installed (https://httpie.io/)
# Usage: bash test-auth.sh

BASE_URL="http://localhost:3000"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}JWT Authentication Test Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Sign Up
echo -e "${YELLOW}1️⃣  Testing Sign-Up...${NC}"
SIGNUP_RESPONSE=$(http POST $BASE_URL/api/auth/sign-up \
  name="Test User" \
  email="test@example.com" \
  password="TestPassword123!" \
  role="user" \
  --print=b)

if echo "$SIGNUP_RESPONSE" | grep -q "User registered"; then
  echo -e "${GREEN}✅ Sign-Up Successful${NC}"
  USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
  echo "User ID: $USER_ID"
else
  echo -e "${RED}❌ Sign-Up Failed${NC}"
  echo "$SIGNUP_RESPONSE"
  exit 1
fi

echo ""

# 2. Get Own User Data (Should Work)
echo -e "${YELLOW}2️⃣  Testing Get Own User Data...${NC}"
GET_RESPONSE=$(http GET $BASE_URL/api/users/$USER_ID --print=b)

if echo "$GET_RESPONSE" | grep -q "\"id\":$USER_ID"; then
  echo -e "${GREEN}✅ Get Own User Data Successful${NC}"
else
  echo -e "${RED}❌ Get Own User Data Failed${NC}"
  echo "$GET_RESPONSE"
fi

echo ""

# 3. Try to Get Another User's Data (Should Fail)
echo -e "${YELLOW}3️⃣  Testing Get Another User's Data (Should Fail)...${NC}"
OTHER_USER_ID=$((USER_ID + 1))
GET_OTHER_RESPONSE=$(http GET $BASE_URL/api/users/$OTHER_USER_ID --print=b 2>&1)

if echo "$GET_OTHER_RESPONSE" | grep -q "Forbidden"; then
  echo -e "${GREEN}✅ Correctly Rejected Unauthorized Access${NC}"
else
  echo -e "${YELLOW}⚠️  Unexpected Response${NC}"
fi

echo ""

# 4. Update Own User Data
echo -e "${YELLOW}4️⃣  Testing Update Own User Data...${NC}"
UPDATE_RESPONSE=$(http PUT $BASE_URL/api/users/$USER_ID \
  name="Updated Test User" \
  --print=b)

if echo "$UPDATE_RESPONSE" | grep -q "updated"; then
  echo -e "${GREEN}✅ Update User Data Successful${NC}"
else
  echo -e "${RED}❌ Update User Data Failed${NC}"
  echo "$UPDATE_RESPONSE"
fi

echo ""

# 5. Try to Delete (Should Fail - Not Admin)
echo -e "${YELLOW}5️⃣  Testing Delete Without Admin Role (Should Fail)...${NC}"
DELETE_RESPONSE=$(http DELETE $BASE_URL/api/users/$USER_ID --print=b 2>&1)

if echo "$DELETE_RESPONSE" | grep -q "Forbidden\|Admin"; then
  echo -e "${GREEN}✅ Correctly Rejected Non-Admin Delete${NC}"
else
  echo -e "${YELLOW}⚠️  Unexpected Response${NC}"
fi

echo ""

# 6. Sign Out
echo -e "${YELLOW}6️⃣  Testing Sign-Out...${NC}"
SIGNOUT_RESPONSE=$(http POST $BASE_URL/api/auth/sign-out --print=b)

if echo "$SIGNOUT_RESPONSE" | grep -q "signed out"; then
  echo -e "${GREEN}✅ Sign-Out Successful${NC}"
else
  echo -e "${RED}❌ Sign-Out Failed${NC}"
  echo "$SIGNOUT_RESPONSE"
fi

echo ""

# 7. Try to Access After Sign Out (Should Fail)
echo -e "${YELLOW}7️⃣  Testing Access After Sign-Out (Should Fail)...${NC}"
AFTER_LOGOUT=$(http GET $BASE_URL/api/users/$USER_ID --print=b 2>&1)

if echo "$AFTER_LOGOUT" | grep -q "Unauthorized\|MISSING_TOKEN"; then
  echo -e "${GREEN}✅ Correctly Rejected Access After Sign-Out${NC}"
else
  echo -e "${YELLOW}⚠️  Unexpected Response${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ All Tests Completed!${NC}"
echo -e "${BLUE}========================================${NC}"

