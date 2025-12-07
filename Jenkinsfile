pipeline {
    agent any

    environment {
        VENV = "${WORKSPACE}/venv"
        EC2_USER = "ubuntu"
        EC2_HOST = "ec2-44-200-143-13.compute-1.amazonaws.com"
        APP_DIR = "/home/ubuntu/hotel-app-dev-ops"
        BACKEND_DIR = "${WORKSPACE}/backend"
        FRONTEND_DIR = "${WORKSPACE}/frontend"
        SELENIUM_DIR = "${WORKSPACE}/selenium-tests"
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
                sh "./venv/bin/pip install -r ${SELENIUM_DIR}/requirements.txt"
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo 'Installing Node.js backend dependencies...'
                sh """
                    cd ${BACKEND_DIR}
                    npm install
                    npm run build
                """
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo 'Installing frontend dependencies...'
                sh """
                    cd ${FRONTEND_DIR}
                    npm install
                """
            }
        }

        stage('Start Backend') {
            steps {
                echo 'Starting backend server...'
                sh """
                    cd ${BACKEND_DIR}
                    npm run dev &  # nodemon will start backend
                    sleep 5        # wait for server to start
                """
            }
        }

        stage('Start Frontend') {
            steps {
                echo 'Starting frontend server...'
                sh """
                    cd ${FRONTEND_DIR}
                    npm run dev &  # vite dev server
                    sleep 10       # wait for frontend
                """
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh "./venv/bin/pytest -v --maxfail=1 --disable-warnings ${SELENIUM_DIR}/"
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo "Deploying app to EC2: ${EC2_HOST}"
                sh """
                    scp -r ./* ${EC2_USER}@${EC2_HOST}:${APP_DIR}
                """
                sh """
                    ssh ${EC2_USER}@${EC2_HOST} << 'ENDSSH'
                    cd ${APP_DIR}
                    docker-compose down
                    docker-compose up -d --build
                    ENDSSH
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded! Selenium tests passed and app deployed.'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
