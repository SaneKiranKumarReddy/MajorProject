pipeline {
  agent any

  // Keep console tidy, set a hard cap on job time
  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
  }

  // Make browser binaries persistent across builds to avoid re-downloads.
  // Create this folder first and ensure the Jenkins service account has RW access.
  environment {
    PLAYWRIGHT_BROWSERS_PATH = 'D:\\pw-browsers'
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install dependencies') {
      steps {
        // Color wrapper for readable logs (requires AnsiColor plugin)
        wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
          bat 'node -v'
          bat 'npm -v'
          bat 'npm ci'
        }
      }
    }

    stage('Install Playwright browsers (idempotent)') {
      steps {
        wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
          // 1st run downloads; subsequent runs reuse D:\pw-browsers
          bat 'npx playwright install'
        }
      }
    }

    stage('Cross-browser tests') {
      matrix {
        axes {
          axis {
            name 'BROWSER'
            values 'chromium', 'firefox', 'webkit'   // webkit ≈ Safari engine in Playwright
          }
        }
        stages {
          stage('Run') {
            steps {
              wrap([$class: 'AnsiColorBuildWrapper', colorMapName: 'xterm']) {
                // If your config defines the projects, this just selects them.
                bat "npx playwright test --project=%BROWSER%"
              }
            }
            post {
              always {
                // If you enabled JUnit reporter in playwright.config.js, publish results:
                // junit testResults: 'test-results/junit/results.xml', allowEmptyResults: true

                // Archive HTML report (created by Playwright's html reporter)
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

                // (Optional) Archive traces/screenshots if you save them
                archiveArtifacts artifacts: 'test-results/**/*.zip, test-results/**/*.png', allowEmptyArchive: true
              }
            }
          }
        }
      }
    }
  }

  post {
    success { echo '✅ All 3 browsers passed.' }
    failure { echo '❌ One or more browsers failed. Check the reports and console output.' }
  }
}
