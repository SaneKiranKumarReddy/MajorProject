pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Install Playwright browsers (fresh each run)') {
      steps {
        bat 'npx playwright install'
      }
    }

    stage('Run - Chromium') {
      steps {
        bat 'npx playwright test --project=chromium'
      }
      post {
        always {
          archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
      }
    }

    stage('Run - Firefox') {
      steps {
        bat 'npx playwright test --project=firefox'
      }
      post {
        always {
          archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
      }
    }

    stage('Run - WebKit') {
      steps {
        bat 'npx playwright test --project=webkit'
      }
      post {
        always {
          archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
      }
    }
  }
}
