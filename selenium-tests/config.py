import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Application URL
    BASE_URL = os.getenv('BASE_URL', 'http://localhost:5173')
    
    # Test user credentials
    TEST_USER_EMAIL = os.getenv('TEST_USER_EMAIL', 'testuser@example.com')
    TEST_USER_PASSWORD = os.getenv('TEST_USER_PASSWORD', 'password123')
    TEST_USER_FIRSTNAME = os.getenv('TEST_USER_FIRSTNAME', 'Test')
    TEST_USER_LASTNAME = os.getenv('TEST_USER_LASTNAME', 'User')
    
    # Browser settings
    HEADLESS = os.getenv('HEADLESS', 'False').lower() == 'true'
    IMPLICIT_WAIT = int(os.getenv('IMPLICIT_WAIT', '20'))
    PAGE_LOAD_TIMEOUT = int(os.getenv('PAGE_LOAD_TIMEOUT', '90'))
    
    # Test data
    TEST_HOTEL_NAME = 'Test Hotel Selenium'
    TEST_HOTEL_CITY = 'New York'
    TEST_HOTEL_COUNTRY = 'USA'
    TEST_HOTEL_DESCRIPTION = 'A beautiful test hotel for selenium testing'
    TEST_HOTEL_PRICE = '150'
    TEST_HOTEL_RATING = '5'
