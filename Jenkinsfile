pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '5'))
    disableConcurrentBuilds()
  }

  environment {
    SERVICE_NAME="landing"
    IMAGE_REPO_NAME = "${CONTAINER_REGISTRY}/leverinvl/${SERVICE_NAME}"
  }
  parameters {
    string(name: 'DOMAIN', defaultValue: 'lever.ng', description: '')
    string(name: 'DOCKER_COMPOSE_FILENAME', defaultValue: 'docker-compose.yml', description: '')
    booleanParam(name: 'PUSH_DOCKER_IMAGES', defaultValue: true, description: '')
  }

  triggers {
      pollSCM '''TZ=Africa/Lagos
                 * * * * *'''
    }

  stages {
    stage('docker login'){
        steps{
          sh "doctl registry login"
        }
    }

    stage('docker build'){
      environment {
        COMMIT_TAG = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(12)
      }
      steps{
        sh "docker-compose build"
        sh "docker tag landing:latest ${IMAGE_REPO_NAME}:${COMMIT_TAG}-prod"
      }
    }
    stage('docker push'){
      when{
        expression {
          return params.PUSH_DOCKER_IMAGES
        }
      }
      environment {
        COMMIT_TAG = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(12)
      }
      steps{
        sh "docker push ${IMAGE_REPO_NAME}:${COMMIT_TAG}-prod"
      }
    }
    stage('Deploy to EKS'){
        environment {
            DOMAIN = "${params.DOMAIN}"
            COMMIT_TAG = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(12)
            IMAGE = "${IMAGE_REPO_NAME}:${COMMIT_TAG}-prod"
          }
      steps{
          sh "doctl registry kubernetes-manifest | kubectl --context=do-fra1-k8s-merchants-ng apply -f -"
          sh "bash deploy.sh"
          // sh "kubectl set image deployments/merchants-landing-page merchants-landing-page=${IMAGE}"
      }
    }
    stage('Cleanup'){
        environment{
            COMMIT_TAG = sh(returnStdout: true, script: 'git rev-parse HEAD').trim().take(12)
        }
        steps{
            sh "docker image rm landing:latest"
            sh "docker image rm ${IMAGE_REPO_NAME}:${COMMIT_TAG}-prod"
        }
    }
  }
  post {
    always {
      sh 'echo "This will always run"'
    }
  }
}
