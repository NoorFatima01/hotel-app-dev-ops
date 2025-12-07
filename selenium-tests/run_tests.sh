#!/bin/bash
# Shell script to run Selenium tests on Linux/Mac (for Jenkins/EC2)

echo "========================================"
echo "Selenium Test Suite Runner"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo ""

# Install dependencies
echo "Installing/Updating dependencies..."
pip install -r requirements.txt
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please update .env file with your configuration"
    echo ""
fi

# Run tests
echo "========================================"
echo "Running Selenium Tests..."
echo "========================================"
echo ""

pytest -v --html=report.html --self-contained-html

echo ""
echo "========================================"
echo "Test execution completed!"
echo "========================================"
echo ""
echo "Test report generated: report.html"
echo ""
