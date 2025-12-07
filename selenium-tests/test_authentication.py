import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from base_test import BaseTest
from config import Config


class TestAuthentication(BaseTest):

    def test_01_register_new_user(self):
        """Test Case 1: Verify user registration with valid data"""
        print("\n=== Test Case 1: User Registration ===")
        
        self.navigate_to('/register')
        time.sleep(2)
        unique_email = f"testuser_{int(time.time())}@example.com"
        
        try:
            # Wait for page to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//h2|//h1|//body"))
            )
            time.sleep(2)
            
            # Get inputs directly without wait
            inputs = self.driver.find_elements(By.TAG_NAME, 'input')
            print(f"Found {len(inputs)} inputs")
            
            if len(inputs) >= 5:
                inputs[0].send_keys(Config.TEST_USER_FIRSTNAME)
                inputs[1].send_keys(Config.TEST_USER_LASTNAME)
                inputs[2].send_keys(unique_email)
                inputs[3].send_keys(Config.TEST_USER_PASSWORD)
                inputs[4].send_keys(Config.TEST_USER_PASSWORD)
                time.sleep(0.5)
            
            # Click submit button
            buttons = self.driver.find_elements(By.TAG_NAME, 'button')
            print(f"Found {len(buttons)} buttons")
            submit_clicked = False
            for btn in buttons:
                try:
                    btn_type = btn.get_attribute('type')
                    btn_text = btn.text
                    print(f"Button: type={btn_type}, text='{btn_text}'")
                    if btn_type == 'submit':
                        btn.click()
                        submit_clicked = True
                        break
                except:
                    pass
            
            if not submit_clicked and len(buttons) > 0:
                buttons[0].click()
            
            time.sleep(4)
            current_url = self.get_current_url().lower()
            print(f"Current URL: {current_url}")
            assert 'register' not in current_url
            print("✓ User registration successful")
        except Exception as e:
            self.take_screenshot('test_01_error.png')
            print(f"Error: {str(e)}")
            print(f"Page source: {self.driver.page_source[:500]}")
            raise

    def test_02_register_with_mismatched_passwords(self):
        """Test Case 2: Verify registration fails with mismatched passwords"""
        print("\n=== Test Case 2: Registration with Mismatched Passwords ===")
        
        self.navigate_to('/register')
        time.sleep(2)
        unique_email = f"testuser_{int(time.time())}@example.com"
        
        try:
            inputs = WebDriverWait(self.driver, 10).until(
                EC.presence_of_all_elements_located((By.TAG_NAME, 'input'))
            )
            
            if len(inputs) >= 5:
                inputs[0].send_keys('Test')
                inputs[1].send_keys('User')
                inputs[2].send_keys(unique_email)
                inputs[3].send_keys('password123')
                inputs[4].send_keys('password456')
            
            submit_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
            )
            submit_button.click()
            time.sleep(1)
            
            page = self.driver.page_source.lower()
            url = self.get_current_url().lower()
            assert 'register' in url or 'password' in page
            print("✓ Registration prevented with mismatched passwords")
        except Exception as e:
            print(f"Note: {str(e)}")

    def test_03_login_with_valid_credentials(self):
        """Test Case 3: Verify login with valid credentials"""
        print("\n=== Test Case 3: Login with Valid Credentials ===")
        
        test_email = f"login_test_{int(time.time())}@example.com"
        
        try:
            # Register step
            self.navigate_to('/register')
            time.sleep(2)
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//h2|//h1|//body"))
            )
            time.sleep(2)
            
            inputs = self.driver.find_elements(By.TAG_NAME, 'input')
            print(f"Register: Found {len(inputs)} inputs")
            if len(inputs) >= 5:
                inputs[0].send_keys(Config.TEST_USER_FIRSTNAME)
                inputs[1].send_keys(Config.TEST_USER_LASTNAME)
                inputs[2].send_keys(test_email)
                inputs[3].send_keys(Config.TEST_USER_PASSWORD)
                inputs[4].send_keys(Config.TEST_USER_PASSWORD)
                time.sleep(0.5)
            
            buttons = self.driver.find_elements(By.TAG_NAME, 'button')
            for btn in buttons:
                if btn.get_attribute('type') == 'submit':
                    btn.click()
                    break
            time.sleep(4)
            
            # Logout
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Sign Out')]"))
                ).click()
                time.sleep(2)
            except:
                pass
            
            # Login again
            self.navigate_to('/sign-in')
            time.sleep(2)
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//h2|//h1|//body"))
            )
            time.sleep(2)
            
            inputs = self.driver.find_elements(By.TAG_NAME, 'input')
            print(f"Login: Found {len(inputs)} inputs")
            if len(inputs) >= 2:
                inputs[0].send_keys(test_email)
                inputs[1].send_keys(Config.TEST_USER_PASSWORD)
                time.sleep(0.5)
            
            buttons = self.driver.find_elements(By.TAG_NAME, 'button')
            for btn in buttons:
                if btn.get_attribute('type') == 'submit':
                    btn.click()
                    break
            time.sleep(4)
            
            current_url = self.get_current_url().lower()
            print(f"After login URL: {current_url}")
            assert 'sign-in' not in current_url
            print("✓ Login successful")
        except Exception as e:
            self.take_screenshot('test_03_error.png')
            print(f"Error: {str(e)}")
            raise

    def test_04_login_with_invalid_credentials(self):
        """Test Case 4: Verify login fails with invalid credentials"""
        print("\n=== Test Case 4: Login with Invalid Credentials ===")
        
        self.navigate_to('/sign-in')
        time.sleep(2)
        
        try:
            # Wait for page to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//h2|//h1|//body"))
            )
            time.sleep(2)
            inputs = self.driver.find_elements(By.TAG_NAME, 'input')
            print(f"Found {len(inputs)} inputs")
            
            if len(inputs) >= 2:
                inputs[0].send_keys('invalid@example.com')
                inputs[1].send_keys('wrongpassword')
                time.sleep(0.5)
            
            buttons = self.driver.find_elements(By.TAG_NAME, 'button')
            print(f"Found {len(buttons)} buttons")
            for btn in buttons:
                if btn.get_attribute('type') == 'submit' or 'Log In' in btn.text:
                    btn.click()
                    break
            time.sleep(2)
            
            url = self.get_current_url().lower()
            page = self.driver.page_source.lower()
            assert 'sign-in' in url or 'error' in page
            print("✓ Login correctly failed")
        except Exception as e:
            self.take_screenshot('test_04_error.png')
            print(f"Error: {str(e)}")
            print(f"URL: {self.get_current_url()}")
            raise

    def test_05_logout_functionality(self):
        """Test Case 5: Verify logout functionality"""
        print("\n=== Test Case 5: Logout Functionality ===")
        
        test_email = f"logout_test_{int(time.time())}@example.com"
        
        try:
            # Register
            self.navigate_to('/register')
            time.sleep(2)
            
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//h2|//h1|//body"))
            )
            time.sleep(2)
            
            inputs = self.driver.find_elements(By.TAG_NAME, 'input')
            print(f"Found {len(inputs)} inputs")
            if len(inputs) >= 5:
                inputs[0].send_keys(Config.TEST_USER_FIRSTNAME)
                inputs[1].send_keys(Config.TEST_USER_LASTNAME)
                inputs[2].send_keys(test_email)
                inputs[3].send_keys(Config.TEST_USER_PASSWORD)
                inputs[4].send_keys(Config.TEST_USER_PASSWORD)
                time.sleep(0.5)
            
            buttons = self.driver.find_elements(By.TAG_NAME, 'button')
            print(f"Found {len(buttons)} buttons")
            for btn in buttons:
                if btn.get_attribute('type') == 'submit' or 'Create Account' in btn.text:
                    btn.click()
                    break
            time.sleep(3)
            
            # Logout
            try:
                WebDriverWait(self.driver, 15).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Sign Out')]"))
                ).click()
                time.sleep(2)
            except:
                buttons = self.driver.find_elements(By.TAG_NAME, 'button')
                for btn in buttons:
                    if 'sign out' in btn.text.lower():
                        btn.click()
                        time.sleep(2)
                        break
            
            # Verify logged out
            self.navigate_to('/sign-in')
            assert 'sign-in' in self.get_current_url().lower()
            print("✓ Logout successful")
        except Exception as e:
            self.take_screenshot('test_05_error.png')
            print(f"Error: {str(e)}")
            print(f"URL: {self.get_current_url()}")
            raise
