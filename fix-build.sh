#!/bin/bash

echo "🔧 Fix Build Issues - External Ollama ECU"
echo "========================================="

# Install dependencies if needed
echo "Installing dependencies..."
npm ci

# Test TypeScript compilation
echo "Testing TypeScript compilation..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Checking specific files..."
    
    # Check if the problematic file exists and fix it
    if grep -q "ai-linols" src/pages/ZorluEcuAdminDashboardEnhanced.tsx; then
        echo "Fixing ai-linols references..."
        sed -i 's/ai-linols/ai-ecu/g' src/pages/ZorluEcuAdminDashboardEnhanced.tsx
    fi
    
    # Test again
    echo "Testing TypeScript compilation again..."
    npx tsc --noEmit
fi

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
    
    echo "Building project..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
        echo "Now you can run: docker compose up -d"
    else
        echo "❌ Build failed"
        exit 1
    fi
else
    echo "❌ TypeScript errors still exist"
    echo "Manual fix needed in ZorluEcuAdminDashboardEnhanced.tsx"
    exit 1
fi