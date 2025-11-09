pipeline {
    agent any
    
    environment {
        JWT_SECRET = credentials('JWT_SECRET')
        MONGODB_URI = credentials('MONGODB_URI')
        S3_ACCESS_KEY = credentials('S3_ACCESS_KEY')
        S3_BUCKET_NAME = credentials('S3_BUCKET_NAME')
        S3_REGION = credentials('S3_REGION')
        S3_SECRET_KEY = credentials('S3_SECRET_KEY')
        DEPLOY_ENV = credentials('DEPLOY_ENV')
        STRIPE_API_KEY = credentials('STRIPE_API_KEY')
    }
    
    stages {
        stage('Cleanup Before Build') {
            steps {
                echo 'Aggressive cleanup...'
                sh '''
                    docker system prune -af --volumes
                    docker builder prune -af
                '''
            }
        }
        
        stage('Checkout Code') {
            steps {
                echo 'Fetching code from GitHub...'
                git branch: 'main', 
                    url: 'https://github.com/NoorFatima01/hotel-app-dev-ops.git'
            }
        }
        
        stage('Stop Existing Containers') {
            steps {
                echo 'Stopping any existing containers...'
                sh 'docker-compose down || true'
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo 'Building and deploying application...'
                sh '''
                    export JWT_SECRET="${JWT_SECRET}"
                    export MONGODB_URI="${MONGODB_URI}"
                    export S3_ACCESS_KEY="${S3_ACCESS_KEY}"
                    export S3_BUCKET_NAME="${S3_BUCKET_NAME}"
                    export S3_REGION="${S3_REGION}"
                    export S3_SECRET_KEY="${S3_SECRET_KEY}"
                    export DEPLOY_ENV="${DEPLOY_ENV}"
                    docker-compose up -d --build
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying containers...'
                sh 'docker-compose ps'
                sh 'docker ps'
            }
        }
        
        stage('Check Application Health') {
            steps {
                echo 'Waiting for application to start...'
                sh 'sleep 15'
                sh 'curl -f http://localhost:8000 || echo "App still starting..."'
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
            // Clean up old images but keep current
            sh 'docker image prune -f || true'
        }
        failure {
            echo 'Deployment failed!'
            sh 'docker-compose logs || true'
        }
    }
}