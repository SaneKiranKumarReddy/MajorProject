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

        stage('Install Playwright Browsers (always download)') {
            steps {
                // This ALWAYS downloads Chromium + Firefox + WebKit
                bat 'npx playwright install'
            }
        }

        stage('Run Tests on All Browsers') {
            steps {
                // Runs all Playwright projects defined in your playwright.config.js
                bat 'npx playwright test'
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            }
        }
    }
}
