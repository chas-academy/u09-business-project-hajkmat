#!/usr/bin/env bash
# Install TypeScript globally
npm install -g typescript

# Install all dependencies
npm ci

# Install necessary type definitions
npm install --save-dev @types/node @types/express @types/passport @types/passport-google-oauth20 @types/cors @types/jest @types/supertest

# Print TypeScript version to verify
tsc --version

# Run the build with skipLibCheck to ignore issues in node_modules
./node_modules/.bin/tsc --skipLibCheck
