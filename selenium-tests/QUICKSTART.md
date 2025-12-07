# Selenium Test Suite - Quick Start Guide

## ⚡ Quick Start (Windows)

### Option 1: Using Batch Script (Easiest)

```cmd
cd selenium-tests
run_tests.bat
```

### Option 2: Manual Setup

```cmd
cd selenium-tests
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
pytest -v
```

## ⚡ Quick Start (Linux/Mac/EC2)

### Option 1: Using Shell Script

```bash
cd selenium-tests
chmod +x run_tests.sh
./run_tests.sh
```

### Option 2: Manual Setup

```bash
cd selenium-tests
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
pytest -v
```

## 🎯 Before Running Tests

### 1. Start Your Application

Make sure both backend and frontend are running:

**Terminal 1 - Backend:**

```cmd
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**

```cmd
cd frontend
npm install
npm run dev
```

**Terminal 3 - MongoDB:**
Ensure MongoDB is running on your system.

### 2. Verify Application is Accessible

Open browser and check: `http://localhost:5173`

### 3. Update Configuration (if needed)

Edit `.env` file in `selenium-tests` directory:

```
BASE_URL=http://localhost:5173
HEADLESS=True
```

## 📊 Running Specific Tests

### Run only authentication tests:

```cmd
pytest test_authentication.py -v
```

### Run only hotel management tests:

```cmd
pytest test_hotel_management.py -v
```

### Run only search tests:

```cmd
pytest test_search_and_booking.py -v
```

### Run with HTML report:

```cmd
pytest --html=report.html --self-contained-html
```

### Run in visible browser mode (not headless):

Edit `.env`: Set `HEADLESS=False`, then:

```cmd
pytest -v
```

## 🔍 Understanding Test Results

### ✅ PASSED

Test executed successfully and assertions passed.

### ❌ FAILED

Test failed. Check the error message for details.

### ⚠️ SKIPPED

Test was skipped (if any conditional tests).

## 📈 Expected Output

```
test_authentication.py::TestAuthentication::test_01_register_new_user PASSED
test_authentication.py::TestAuthentication::test_02_register_with_mismatched_passwords PASSED
test_authentication.py::TestAuthentication::test_03_login_with_valid_credentials PASSED
test_authentication.py::TestAuthentication::test_04_login_with_invalid_credentials PASSED
test_authentication.py::TestAuthentication::test_05_logout_functionality PASSED
test_hotel_management.py::TestHotelManagement::test_06_add_new_hotel PASSED
...

====================== 20 passed in 45.23s ======================
```

## 🐛 Troubleshooting

### Error: "Chrome not found"

Install Chrome browser or update ChromeDriver.

### Error: "Connection refused"

Make sure your application is running on the specified URL.

### Error: "Element not found"

The application UI might have changed. Update selectors in test files.

### Tests are too slow

Decrease `IMPLICIT_WAIT` in `.env` file.

## 🚀 Jenkins Integration

Add to your Jenkinsfile:

```groovy
stage('Selenium Tests') {
    steps {
        dir('selenium-tests') {
            sh '''
                python3 -m venv venv
                . venv/bin/activate
                pip install -r requirements.txt
                pytest -v --html=report.html --self-contained-html
            '''
        }
    }
    post {
        always {
            publishHTML([
                reportDir: 'selenium-tests',
                reportFiles: 'report.html',
                reportName: 'Selenium Test Report'
            ])
        }
    }
}
```

## 📝 Test Coverage

✅ User Registration (Test 1, 2)
✅ User Login (Test 3, 4)
✅ User Logout (Test 5)
✅ Hotel Management (Test 6, 7, 8, 9)
✅ Search Functionality (Test 11, 15)
✅ Filtering (Test 12)
✅ Navigation (Test 9, 16, 18)
✅ UI Components (Test 17, 19)
✅ **Database Persistence** (Test 20) ⭐

## 🎓 Assignment Checklist

- ✅ 10+ test cases (20 implemented)
- ✅ Selenium with Chrome
- ✅ Database integration testing
- ✅ Headless mode for Jenkins/EC2
- ✅ Python programming language
- ✅ Comprehensive documentation

## 💡 Tips

1. **First Run**: Tests might take longer on first run while ChromeDriver downloads
2. **Parallel Execution**: For faster execution, use `pytest -n auto` (requires pytest-xdist)
3. **Debug Mode**: Set `HEADLESS=False` to see browser actions
4. **Screenshots**: Uncomment screenshot lines in tests for visual debugging
5. **Test Data**: Each test creates unique users to avoid conflicts

## 📞 Need Help?

Check these in order:

1. README.md - Full documentation
2. Test output logs - Error messages
3. report.html - Detailed test report
4. Application logs - Backend/frontend issues
5. Database status - MongoDB connection

Good luck with your testing! 🚀
