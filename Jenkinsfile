pipeline {
    agent any

    environment {
        CONTAINER_NAME = "mern-build-app"        // Matches your docker-compose.yml
        COMPOSE_FILE = "docker-compose.yml"
        ENV_FILE_PATH = "/home/ubuntu/.env"      // Path to .env on EC2
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Fetch latest code from GitHub
                git branch: 'main', url: 'https://github.com/NoorFatima01/hotel-app-dev-ops.git'
            }
        }

        stage('Prepare Environment') {
            steps {
                // Copy .env into project directory so docker-compose can access it
                sh """
                cp $ENV_FILE_PATH .env
                """
            }
        }

        stage('Stop Previous Build Container') {
            steps {
                // Stop and remove old build container if it exists
                sh """
                if [ \$(docker ps -aq -f name=$CONTAINER_NAME) ]; then
                    echo "Stopping existing container..."
                    docker rm -f $CONTAINER_NAME || true
                fi
                """
            }
        }

        stage('Build Application with Docker Compose') {
            steps {
                // Use docker-compose (no Dockerfile build this time)
                sh """
                docker-compose -f $COMPOSE_FILE up --build -d
                """
            }
        }

        stage('Verify Build') {
            steps {
                // Verify that container is running
                sh """
                docker ps --filter "name=$CONTAINER_NAME"
                """
            }
        }
    }

    post {
        success {
            echo "Jenkins Build Pipeline completed successfully!"
        }
        failure {
            echo "Jenkins Build Pipeline failed. Check logs for details."
        }
        always {
            sh "docker system prune -f"
            echo "Cleaned up unused Docker resources."
        }
    }
}
