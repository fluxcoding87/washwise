def gv

pipeline{
    agent any
    environment {
        DATABASE_URL= credentials("DATABASE_URL")
        DATABASE_URL_UNPOOLED = credentials("DATABASE_URL_UNPOOLED")
        NEXTAUTH_SECRET='NEXTAUTH_SECRET'
    }
    tools{
        nodejs 'node-latest'
    }
    parameters{
        choice(name:"VERSION", choices:["1.0.0","1.1.0","1.2.0"], description:"Specify the version of the app you want to build")
    }
    stages{
        stage ("init"){
            steps{
                script{
                    gv = load "script.groovy"
                }
            }
        }
        stage ("pre-build"){
            steps{
                echo "Installing Dependencies"
                sh "npm install"
            }
        }
        stage ("build"){
            steps{
                echo "Running build command"
                sh "npm run build"
            }
        }
        stage ("test"){
            when{
                expression{
                    BRANCH_NAME == 'dev'
                }
            }
            steps{
                echo "testing....."
            }
        }
        stage ("deployment"){
            steps{
                script {
                    gv.deployApp()
                }
            }
        }
    }
}