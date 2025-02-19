pipeline{
  agent any

  stages {

    stage("build"){
      steps{
        echo 'building the application-using server on pc'
      }
    }

    stage("test"){
      steps{
        echo "Testing the application- using slave on pc"
      }
    }

    stage("deploy"){
      steps{
        echo "Deploying the application"
      }
    }

  }

}
