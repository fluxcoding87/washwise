pipeline {
    agent { label 'ec2-node' }
    environment {
        // Docker image name
        IMAGE_NAME='washwise-backend'
        // AWS EC2 Instance Details
        EC2_USER='ubuntu'
        EC2_HOST='13.201.61.153'
        EC2_SSH_KEY= credentials('EC2-SSH-KEY')
        // DOCKER REPO URL
        DOCKER_REGISTRY='fluxcoding87'
        SONARQUBE_PROJECT_KEY='washwise'
        SONAR_HOST_URL='http://sonarqube:9000'
        SONARQUBE_TOKEN= credentials('Sonar-Token')
    }
    stages{
        stage('build'){
            steps{
            //build docker image
            sh """
            docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
            docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
            """
            }
        }
        stage('sonarqube analysis'){
            steps{
                script{
                    withSonarQubeEnv('Sonar-Server'){
                        sh """
                        sonar-scanner \
                        -Dsonar.projectKey=${SONARQUBE_PROJECT_KEY} \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL} \
                        -Dsonar.login=${SONARQUBE_TOKEN}
                        """
                    }
                }
            }
        }
        stage ('push image to docker registry'){
            steps{
                sh """
                docker login
                docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }
        stage ('deploy on aws ec2'){
            steps{
            script {
                    // SSH into the EC2 instance and pull the Docker image
                    sshagent([SSH_CREDENTIALS_ID]) {
                        sh """
                        ssh -o StrictHostKeyChecking=no -i ${EC2_SSH_KEY} ${EC2_USER}@${EC2_HOST} << EOF
                            docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                            docker stop washwise || true
                            docker rm washwise || true
                            docker run -d --name washwise -p 80:3000 ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                        EOF
                        """
                    }
                }
        }
        }
    }
    post {
        always {
            // Clean up Docker images on Jenkins agent after build
            sh "docker rmi ${IMAGE_NAME}:${BUILD_NUMBER} || true"
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}