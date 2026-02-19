pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    // hard cap the entire job
    timeout(time: 45, unit: 'MINUTES')
  }

  environment {
    CI = 'true'  // tells Playwright "we're in CI"
    // DEBUG = 'pw:api' // uncomment for very verbose PW logs
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install deps') {
      steps {
        bat 'node -v'
        bat 'npm -v'
        bat 'npm ci'
      }
    }

    stage('Install PW Browsers') {
      steps {
        bat 'npx playwright install'
      }
    }

    stage('Cross-browser matrix') {
      matrix {
        axes {
          axis {
            name 'BROWSER'
            values 'chromium', 'firefox', 'webkit'
          }
        }
        stages {
          stage('Run tests') {
            steps {
              // Per-branch timeout in case a project hangs
              timeout(time: 20, unit: 'MINUTES') {
                // Keep it headless in CI. If you need headed, run the agent
                // as an interactive user and use a desktop session.
                bat "npx playwright test --project=%BROWSER% --reporter=list,junit"
              }
            }
            post {
              always {
                // JUnit: enable in playwright.config.js
                junit testResults: 'test-results/junit/results.xml', allowEmptyResults: true
                // HTML report (created by PW’s html reporter)
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                // Traces/screens if you keep them
                archiveArtifacts artifacts: 'test-results/**/*.zip, test-results/**/*.png', allowEmptyArchive: true
              }
            }
          }
        }
      }
    }
  }

  post {
    success { echo '✅ All browsers passed.' }
    failure { echo '❌ Some browser(s) failed. Check Console + Reports.' }
    always  { echo "Pipeline finished at ${new Date()}" }
  }
}
