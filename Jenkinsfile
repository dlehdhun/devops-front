pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'front-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                    docker build \
                    --build-arg REACT_APP_API_BASE_URL=http://15.164.163.6:8088/api \
                    -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                """
            }
        }

        stage('Docker Run') {
            steps {
                sh "docker stop ${DOCKER_IMAGE} || true"
                sh "docker rm ${DOCKER_IMAGE} || true"
                sh "docker run -d -p 80:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
    }

    post {
        failure {
            echo 'Frontend pipeline failed'
        }
        success {
            echo 'Frontend deployed successfully'
        }
    }
}
