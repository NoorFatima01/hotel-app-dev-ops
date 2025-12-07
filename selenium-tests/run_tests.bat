@echo off
REM Batch script to run Selenium tests on Windows

echo ========================================
echo Selenium Test Suite Runner
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Install dependencies
echo Installing/Updating dependencies...
pip install -r requirements.txt
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please update .env file with your configuration
    echo.
)

REM Run tests
echo ========================================
echo Running Selenium Tests...
echo ========================================
echo.

pytest -v --html=report.html --self-contained-html

echo.
echo ========================================
echo Test execution completed!
echo ========================================
echo.
echo Test report generated: report.html
echo.

pause
