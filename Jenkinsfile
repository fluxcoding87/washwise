pipeline {
    agent {label 'jenkins-slave'}

    environment {
        // Replace with the name of your SonarQube server configured in Jenkins
        SONARQUBE_SERVER = 'Sonar-Server'
        DATABASE_URL = credentials('DATABASE_URL')
        DATABASE_URL_UNPOOLED = credentials('DATABASE_URL_UNPOOLED')
        NEXTAUTH_SECRET = credentials('NEXTAUTH_SECRET')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                // Install Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
                // Build the TypeScript project
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // Run the SonarScanner within the Docker container where it is installed
                    docker.image('sonarqube').inside {
                        withSonarQubeEnv(SONARQUBE_SERVER) {
                            // Running SonarScanner
                            sh """
                                sonar-scanner \
                                -Dsonar.projectKey=washwise \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=node_modules/**,dist/** \
                                -Dsonar.host.url=http://sonarqube:9000/ \   // Use SonarQube container name
                                -Dsonar.login=sqp_5eeed220246dc379a8b62532ec8e5f9792124947
                            """
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                // Wait for SonarQube quality gate result
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
