#!/usr/bin/env bash
# Install TypeScript globally
npm install -g typescript

# Install all dependencies
npm ci

# Install TypeScript and necessary type definitions locally
npm install --save-dev typescript @types/node @types/express @types/passport @types/passport-google-oauth20 @types/cors @types/jest @types/supertest

# Use npx to run the locally installed TypeScript compiler
npx tsc --skipLibCheck
