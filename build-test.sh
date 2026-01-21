#!/bin/bash

echo "🔧 Testing TypeScript Build"
echo "=========================="

# Test TypeScript compilation
echo "Running TypeScript check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
    
    echo "Running Vite build..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
    else
        echo "❌ Vite build failed"
        exit 1
    fi
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi