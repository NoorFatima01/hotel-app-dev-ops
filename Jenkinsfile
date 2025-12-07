pipeline {
    agent {
        docker {
            // Selenium standalone Chrome image with Python installed
            image 'selenium/standalone-chrome:latest'
            args '-u root:root' // run as root to allow pip installs
        }
    }

    environment {
        VENV = "${WORKSPACE}/venv"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/NoorFatima01/hotel-app-dev-ops'
            }
        }

        stage('Setup Python') {
            steps {
                sh 'python3 -m venv venv'
                sh './venv/bin/pip install --upgrade pip'
                sh './venv/bin/pip install -r requirements.txt'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh './venv/bin/pytest -v --maxfail=1 --disable-warnings tests/'
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace"
            cleanWs()
        }
        success {
            echo "All Selenium tests passed!"
        }
        failure {
            echo "Some Selenium tests failed!"
        }
    }
}
