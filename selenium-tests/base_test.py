import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from config import Config

class BaseTest:
    
    driver = None
    
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        # Setup
        chrome_options = Options()
        
        # Configure for headless mode (required for Jenkins/EC2)
        if Config.HEADLESS:
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
        
        # Additional options for stability
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        
        # Use Selenium Manager (built-in, no external dependencies needed)
        # This automatically handles driver downloads and version matching
        self.driver = webdriver.Chrome(options=chrome_options)
        
        # Set timeouts
        self.driver.implicitly_wait(Config.IMPLICIT_WAIT)
        self.driver.set_page_load_timeout(Config.PAGE_LOAD_TIMEOUT)
        
        yield
        
        # Teardown
        if self.driver:
            self.driver.quit()
    
    def navigate_to(self, path=''):
        url = f"{Config.BASE_URL}{path}"
        self.driver.get(url)
    
    def get_current_url(self):
        return self.driver.current_url
    
    def take_screenshot(self, filename):
        self.driver.save_screenshot(filename)
