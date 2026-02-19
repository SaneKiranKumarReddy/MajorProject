pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')   // hard cap so builds never hang forever
  }

  // Optional: set a persistent folder so Playwright doesn't re-download browsers every build
  // Make sure this path exists and the Jenkins service account has read/write access.
  environment {
    PLAYWRIGHT_BROWSERS_PATH = 'D:\\pw-browsers'   // change or remove if you don't want to persist
    CI = 'true'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat 'node -v'
        bat 'npm -v'
        bat 'npm ci'                  // installs node_modules (repo does not need to contain them)
      }
    }

    stage('Install Playwright browsers') {
      steps {
        // First time it downloads; subsequent runs reuse D:\pw-browsers
        bat 'npx playwright install'
      }
    }

    stage('Run in Chromium, Firefox, WebKit') {
      matrix {
        axes {
          axis {
            name 'BROWSER'
            values 'chromium', 'firefox', 'webkit'
          }
        }
        stages {
          stage('Test') {
            steps {
              // Assumes your playwright.config.* defines projects named chromium/firefox/webkit
              bat "npx playwright test --project=%BROWSER%"
            }
            post {
              always {
                // If you enabled JUnit reporter in playwright config, publish results:
                // junit testResults: 'test-results/junit/results.xml', allowEmptyResults: true

                // Archive HTML report so you can view it from Jenkins
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

                // (Optional) if you save traces/screenshots, keep them too
                archiveArtifacts artifacts: 'test-results/**/*.zip, test-results/**/*.png', allowEmptyArchive: true
              }
            }
          }
        }
      }
    }
  }

  post {
    success { echo ' Tests passed on chromium, firefox, and webkit.' }
    failure { echo ' Some browser failed. Check console and reports.' }
  }
}
