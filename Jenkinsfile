
pipeline {
    agent 'jenkins-slave'

    environment {
        // Replace with the name of your SonarQube server configured in Jenkins
        SONARQUBE_SERVER = 'Sonar-Server'
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
                // SonarQube analysis step using SonarScanner
                withSonarQubeEnv(SONARQUBE_SERVER) {
                    // Running SonarScanner
                    sh """
                        sonar-scanner \
                        -Dsonar.projectKey=washwise \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,dist/** \
                        -Dsonar.host.url=http://localhost:9000/ \
                        -Dsonar.login=sqp_5eeed220246dc379a8b62532ec8e5f9792124947
                    """
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
