# Selenium Automated Test Suite for Hotel Booking Application

This directory contains automated test cases using Selenium WebDriver for testing the Hotel Booking web application. The test suite includes 20+ comprehensive test cases covering authentication, hotel management, search, and booking functionality.

## 🎯 Assignment Requirements Met

- ✅ **10+ Test Cases**: 20 automated test cases implemented
- ✅ **Selenium Framework**: Using Selenium WebDriver 4.15.2
- ✅ **Database Integration**: Tests verify database persistence through user registration and re-login
- ✅ **Chrome Browser**: Configured for Chrome/Chromium
- ✅ **Headless Mode**: Configured for headless Chrome (required for Jenkins/AWS EC2)
- ✅ **Programming Language**: Python 3.x with pytest framework

## 📋 Test Cases Overview

### Authentication Tests (test_authentication.py)

1. **Test Case 1**: User registration with valid data
2. **Test Case 2**: Registration with mismatched passwords (validation)
3. **Test Case 3**: Login with valid credentials
4. **Test Case 4**: Login with invalid credentials
5. **Test Case 5**: Logout functionality

### Hotel Management Tests (test_hotel_management.py)

6. **Test Case 6**: Add new hotel with valid data
7. **Test Case 7**: View user's hotel listings
8. **Test Case 8**: Add hotel form validation
9. **Test Case 9**: Navigation to add hotel page

### Search and Booking Tests (test_search_and_booking.py)

10. **Test Case 10**: Home page loads successfully
11. **Test Case 11**: Search hotels by destination
12. **Test Case 12**: Filter hotels by star rating
13. **Test Case 13**: View hotel details
14. **Test Case 14**: Pagination on search results
15. **Test Case 15**: Search validation with empty destination
16. **Test Case 16**: Header navigation links
17. **Test Case 17**: Footer presence verification
18. **Test Case 18**: Browser back button functionality
19. **Test Case 19**: Page title verification
20. **Test Case 20**: Database persistence check (Critical - verifies DB integration)

## 🚀 Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Chrome browser installed
- MongoDB running (for database operations)
- Application running on localhost (backend and frontend)

### Installation

1. **Navigate to the selenium-tests directory**:

   ```cmd
   cd hotel-booking-website\selenium-tests
   ```

2. **Create a virtual environment** (recommended):

   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```cmd
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update values as needed:
     ```
     BASE_URL=http://localhost:5173
     HEADLESS=True
     ```

## 🧪 Running Tests

### Run All Tests

```cmd
pytest -v
```

### Run Specific Test File

```cmd
pytest test_authentication.py -v
pytest test_hotel_management.py -v
pytest test_search_and_booking.py -v
```

### Run Specific Test Case

```cmd
pytest test_authentication.py::TestAuthentication::test_01_register_new_user -v
```

### Run with HTML Report

```cmd
pytest --html=report.html --self-contained-html
```

### Run in Headless Mode (for CI/CD)

```cmd
set HEADLESS=True
pytest -v
```

### Run with Verbose Output

```cmd
pytest -v -s
```

## 📊 Test Reports

After running tests with the HTML report option, open `report.html` in your browser to view:

- Test execution summary
- Pass/fail status for each test
- Execution time
- Error messages and stack traces

## 🔧 Configuration

### config.py

Main configuration file containing:

- Application URL
- Test user credentials
- Browser settings (headless mode, timeouts)
- Test data (hotel information)

### base_test.py

Base test class providing:

- WebDriver setup and teardown
- Chrome options for headless execution
- Common utility methods
- Screenshot capability

## 🐳 Jenkins/AWS EC2 Integration

The test suite is configured for CI/CD integration:

### Headless Chrome Configuration

```python
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-gpu')
```

### Jenkins Pipeline Example

```groovy
stage('Run Selenium Tests') {
    steps {
        sh '''
            cd selenium-tests
            pip install -r requirements.txt
            pytest -v --html=report.html --self-contained-html
        '''
    }
}
```

## 📝 Project Structure

```
selenium-tests/
├── requirements.txt          # Python dependencies
├── config.py                 # Test configuration
├── base_test.py             # Base test class
├── test_authentication.py   # Authentication test cases
├── test_hotel_management.py # Hotel management test cases
├── test_search_and_booking.py # Search and booking test cases
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🔍 Key Features

### 1. **Database Integration Testing**

Test Case 20 specifically validates database persistence:

- Registers a new user (writes to MongoDB)
- Logs out
- Re-logs in with same credentials (reads from MongoDB)
- Verifies data persistence across sessions

### 2. **Headless Chrome**

All tests run in headless mode by default, making them suitable for:

- Jenkins CI/CD pipelines
- AWS EC2 instances without display
- Automated test execution

### 3. **Robust Wait Strategies**

- Implicit waits for element loading
- Explicit waits for specific conditions
- Page load timeouts

### 4. **Error Handling**

- Try-catch blocks for graceful failure handling
- Detailed error messages
- Screenshot capability for debugging

## 🛠️ Troubleshooting

### Chrome Driver Issues

The `webdriver-manager` automatically downloads and manages ChromeDriver. If issues occur:

```cmd
pip install --upgrade webdriver-manager
```

### Element Not Found

- Increase `IMPLICIT_WAIT` in `.env`
- Check if application is running
- Verify element selectors match your application

### Headless Mode Issues

For debugging, disable headless mode:

```
HEADLESS=False
```

## 📚 Dependencies

- **selenium**: Web automation framework
- **pytest**: Testing framework
- **webdriver-manager**: Automatic driver management
- **python-dotenv**: Environment variable management
- **pytest-html**: HTML test report generation

## 🎓 Assignment Notes

This test suite fulfills all requirements:

1. ✅ Selenium-based automation
2. ✅ 10+ test cases (20 implemented)
3. ✅ Tests web application with database (MongoDB)
4. ✅ Python programming language
5. ✅ Chrome browser support
6. ✅ Headless Chrome for Jenkins/EC2 deployment

The tests cover critical functionality including:

- User authentication and session management
- CRUD operations for hotels
- Search and filtering
- Navigation and UI components
- **Database persistence verification**

## 📞 Support

For issues or questions:

1. Check test execution logs
2. Review HTML test reports
3. Verify application is running correctly
4. Check database connectivity

## 🔄 Continuous Integration

To integrate with Jenkins:

1. Install Chrome on EC2 instance
2. Set environment variables
3. Run tests in headless mode
4. Archive HTML reports as artifacts

```groovy
post {
    always {
        archiveArtifacts artifacts: 'selenium-tests/report.html', allowEmptyArchive: true
        publishHTML([reportDir: 'selenium-tests', reportFiles: 'report.html', reportName: 'Selenium Test Report'])
    }
}
```
