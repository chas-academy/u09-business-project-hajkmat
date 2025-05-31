#!/usr/bin/env bash
# Install TypeScript explicitly first
npm install -g typescript
# Install all dependencies including dev dependencies
npm ci
# Print TypeScript version to verify it's installed
tsc --version
# Run the build
npm run build
